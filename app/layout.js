import MyToaster from "./myToaster/page";
import SessionWrapper from "./sessionWrapper";

export const metadata = {
  title: "QU Course Management",
  description: "Manage your courses efficiently",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <head />
        <body>
            <SessionWrapper>
              <MyToaster />
              {children}
            </SessionWrapper>
        </body>
      </html>
    </>
  );
}