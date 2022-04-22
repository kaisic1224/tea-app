import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where
} from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin"
  },
  callbacks: {
    async jwt({ token }) {
      let colRef = collection(db, "users");
      const q = query(colRef, where("email", "==", token.email));
      const userDocs = await getDocs(q);

      if (userDocs.empty) {
        let docRef = await addDoc(colRef, {
          name: token.name,
          bio: `${token.name} hasn't added anything about them yet.`,
          recipes: [],
          email: token.email,
          image: token.picture,
          dateJoined: serverTimestamp()
        });
        token.ref = docRef.id;
        return token;
      }

      let recipesRef = collection(db, "recipes");
      const q2 = query(
        recipesRef,
        where("authorId", "==", userDocs.docs.at(0)?.id)
      );
      const recipeDocs = await getDocs(q2);
      const recipeArray: any = [];
      token.ref = userDocs.docs.at(0)?.id;

      recipeDocs.docs.forEach((doc) => {
        recipeArray.push({
          title: doc.get("title"),
          rating: doc.get("rating"),
          approved: doc.get("approved"),
          id: doc.id,
          date: doc.get("date").toDate().toString(),
          authorId: token.ref
        });
      });

      userDocs.docs.forEach((docSnap) => {
        const docRef = doc(db, "users", docSnap.id);
        setDoc(docRef, { recipes: recipeArray }, { merge: true });
      });

      return token;
    },
    async session({ session, token }) {
      session.ref = token.ref;
      return session;
    }
  }
});
