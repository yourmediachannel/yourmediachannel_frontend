type Props = {
    children: React.ReactNode;
  };
  
  export default function LayoutWrapper({ children }: Props) {
    return (
      <div className="bg-black min-h-screen 
      font-arimo overflow-hidden
       px-6 md:px-20 py-10 text-gray-900">
        {children}
      </div>
    );
  }
  