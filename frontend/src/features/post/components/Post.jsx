{posts.map((post) => (
          <div key={post.id} className="post-card">
            {/* HEADER */}
            <div className="post-header">
              <div className="user-info">
                <div className="img-wrapper">
                  <div className="inner-circle">
                    <img src={user.profileImage} alt="user" />
                  </div>
                </div>
                <span>{user.username}</span>
              </div>

              <button className="unfollow-btn">Unfollow</button>
            </div>

            {/* POST IMAGE */}
            <div className="post-image">
              <img src={post.imgUrl} alt="post" />
            </div>

            {/* ACTIONS */}
            <div className="post-actions">
              <div className="left-icons">
                <i className="fa-regular fa-heart"></i>
                <i className="fa-regular fa-comment"></i>
                <i className="fa-regular fa-paper-plane"></i>
              </div>

              <div className="right-icon">
                <i className="fa-regular fa-bookmark"></i>
              </div>
            </div>

            {/* CAPTION */}
            <div className="post-caption">
              <strong>{user.username}</strong> {post.caption}
            </div>
          </div>
        ))}