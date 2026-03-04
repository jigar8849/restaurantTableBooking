// Basic Card Component if needed, but using standard divs for now is fine.
const Card = ({ children, className }) => {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-lg ${className}`}>
            {children}
        </div>
    );
};
export default Card;
