import React from 'react';

class UserAvatar extends React.Component {
   render() {
       return (
           <div className="mint-avatar mint-avatar--small">
               <img className="mint-avatar__image js-avatar-image"
                    src={this.props.user.avatar}
                    alt={this.props.user.name} />
           </div>
       )
   }
}

export default UserAvatar;
