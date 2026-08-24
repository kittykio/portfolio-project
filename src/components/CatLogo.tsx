type CatLogoProps = { className?: string };

/** The shared cat-in-a-bucket-hat brand mark. */
const CatLogo = ({ className = '' }: CatLogoProps) => (
  <img
    src="/logo-kittykio.svg"
    alt="Kitty Kio cat logo wearing a bucket hat"
    className={`h-full w-full object-contain ${className}`}
  />
);

export default CatLogo;
