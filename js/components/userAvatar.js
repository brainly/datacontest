import React from 'react';

const UserAvatar = React.createClass({
   render() {
       return (
           <div className="mint-avatar mint-avatar--small">
               <img className="mint-avatar__image js-avatar-image"
                    src={this.props.user.avatar}
                    alt={this.props.user.name} />
           </div>
       )
   }
});

export default UserAvatar;
