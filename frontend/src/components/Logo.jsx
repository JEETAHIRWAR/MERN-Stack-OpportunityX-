import "./Logo.css";

const Logo = () => {
  return (
    <span className="brand-logo" aria-label="OpportunityX">
      <span className="brand-mark" aria-hidden="true">X<span>↗</span></span>
      <span className="brand-word">Opportunity<strong>X</strong></span>
    </span>
  );
};

export default Logo;
