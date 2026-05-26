export const metadata = {
  title: "Sua Identidade Visual Pronta! | The Brand Box",
  description: "Parabéns! Sua nova identidade visual, logo, submarca e impressos profissionais foram gerados e estão prontos para download.",
  robots: {
    index: false, // Impede indexação de links individuais de entregas de clientes no Google
    follow: false,
  },
};

export default function SucessoLayout({ children }) {
  return <>{children}</>;
}
