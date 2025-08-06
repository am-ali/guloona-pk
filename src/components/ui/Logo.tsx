interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo = ({ className = "", size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`${className}`}>
      <h1 
        className={`${sizeClasses[size]} font-bold text-foreground`}
        style={{ fontFamily: 'Dancing Script, cursive' }}
      >
        guloona
      </h1>
      <p 
        className="text-xs text-muted-foreground font-sans opacity-70"
        style={{ fontSize: '10px', marginTop: '-4px' }}
      >
        est. 2021
      </p>
    </div>
  );
};

export default Logo;
