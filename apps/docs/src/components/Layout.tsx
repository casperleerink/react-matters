interface Props {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-4 py-3">
        <a
          href="#home"
          className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
        >
          &larr; Back
        </a>
        <h1 className="text-sm font-medium">{title}</h1>
      </header>
      {children}
    </div>
  );
};

export default Layout;
