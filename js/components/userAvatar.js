import React from 'react';

const UserAvatar = (props) => {
   return (
       <div className="sg-avatar sg-avatar--small">
           <img className="sg-avatar__image js-avatar-image"
                src={props.user.avatar}
                alt={props.user.name} />
       </div>
   )
};

export default UserAvatar;
