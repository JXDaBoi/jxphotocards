export default function PhotocardItem({ card, onDelete }) {
  return (
    <div className="photocard-item glass-panel">
      <div className="image-wrapper">
        <img src={card.imageUrl} alt={card.name} loading="lazy" />
        {onDelete && (
          <button className="delete-btn" onClick={onDelete} title="Delete Card">
            ×
          </button>
        )}
      </div>
      <div className="photocard-details">
        <h3>{card.name}</h3>
        {card.group && <p className="card-group">{card.group}</p>}
        {card.member && <p className="card-member">{card.member}</p>}
        
        <div className="tags-container">
          {card.tags?.map((tag, idx) => (
            <span key={idx} className="tag-badge">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
