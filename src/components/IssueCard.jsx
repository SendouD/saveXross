export default function IssueCard({ id, user, phoneNo, address, tickPress }) {
    return (
      <div className="issue-card">
        <div>
          <div>
            <span className="ban">ID: </span> {id}
          </div>
          <div>
            <span className="ban">User: </span> {user}
          </div>
          <div>
            <span className="ban">Address: </span> {address}
          </div>
          <div>
            <span className="ban">Phone No: </span> {phoneNo}
          </div>
        </div>
        <div>
          <button className="tick-btn submit" onClick={() => tickPress(id)}>&#10004;</button>
        </div>
      </div>
    );
  }
  