const RoboCard = ({ id, name, email, phone, image, handleClick }) => {
    return (
        <div className="card" onClick={() => handleClick(id)}>
            <img src={image} alt={`${name} profile pic`} loading="lazy" />
            <div className="card-details">
                <p>{name}</p>
                <p>{email}</p>
                <p>{phone}</p>
            </div>
        </div>
    );
};


export default RoboCard;