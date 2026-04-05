
export default function Comments({ comments }) {
  if (!comments) return <p>Loading...</p>

  return (
    <div style={{ margin: 15, width: "450px" }}>
      {comments.map(comment => (
        <div
          key={comment.id}
          style={{
            border: '1px solid black',
            margin: '10px',
          }}
        >
          <div style={{ fontSize: "15px" }}>
            <span style={{ fontWeight: "bold" }}>
              #{comment.id}
            </span>{" "}
            Дата: {comment.create_date}
          </div>
          <div>{comment.text ? comment.text : "\u00A0"} </div>
        </div>
      ))}
    </div>
  )
}