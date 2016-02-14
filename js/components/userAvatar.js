import React from 'react';

const UserAvatar = (props) => {
   return (
       <div className="mint-avatar mint-avatar--small">
           <img className="mint-avatar__image js-avatar-image"
                src={props.user.avatar}
                alt={props.user.name} />
       </div>
   )
};

export default UserAvatar;
