import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Profile
        </h1>
        <p className="text-lg text-gray-600">
          Your profile and achievements
        </p>
      </div>
      
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🚧</div>
        <p className="text-lg text-gray-600">
          Page under development...
        </p>
      </div>
    </div>
  );
};

export default Profile;
