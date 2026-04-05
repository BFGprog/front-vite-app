

export default function Thread({ thread }) {


  if (!thread) return <p>Loading...</p>

  return (
    <div style={{ margin: 15, width: "500px" }}>
      <div
          style={{
            border: "1px solid black",
          }}>
        <div style={{ fontSize: "15px" }}>
          <span style={{ fontWeight: "bold" }}>
            #{thread.id}
          </span>{" "}
          Дата: {thread.create_date}
        </div>
        <div>Тема: {thread.thread}</div>
        <div>{thread.text}</div>
      </div>
    </div>
  )

}