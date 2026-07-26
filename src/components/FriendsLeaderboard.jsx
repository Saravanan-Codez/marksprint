import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Zap, UserPlus, ShieldAlert, Award, UserCheck, Heart, Sparkles, ThumbsUp } from 'lucide-react';
import { getLocalGamificationData, saveGamificationData, getDivisionInfo, fetchFirestoreLeaderboard } from '../services/gamificationService';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';

export default function FriendsLeaderboard() {
  const { user, userProfile } = useAuth();
  const toast = useToast();
  const gamification = getLocalGamificationData();
  
  const [friends, setFriends] = useState(gamification.friends || []);
  const [remoteLeaderboard, setRemoteLeaderboard] = useState(null);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [kudosSent, setKudosSent] = useState({});

  const currentUserDisplayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'You';
  const userXp = gamification.xp || 0;
  const userStreak = gamification.streakDays || 1;
  const currentDivision = getDivisionInfo(userXp);

  // Fetch Firestore leaderboard when component mounts
  useEffect(() => {
    fetchFirestoreLeaderboard().then((dbList) => {
      if (dbList && dbList.length > 0) {
        setRemoteLeaderboard(dbList);
      }
    });
  }, []);

  // Combine remote/local leaderboard data
  const baseList = remoteLeaderboard || [
    {
      id: 'current_user',
      name: `${currentUserDisplayName} (You)`,
      xp: userXp,
      streak: userStreak,
      isCurrentUser: true,
      division: currentDivision.name,
      avatar: gamification.customAvatarUrl || user?.photoURL,
    },
    ...friends,
  ];

  // If remoteLeaderboard present, ensure current user is represented accurately
  const leaderboardList = [...baseList].sort((a, b) => b.xp - a.xp);

  const handleAddFriend = (e) => {
    e.preventDefault();
    const emailClean = newFriendEmail.trim();
    if (!emailClean) return;

    let charSum = 0;
    for (let i = 0; i < emailClean.length; i++) {
      charSum += emailClean.charCodeAt(i);
    }
    const friendXp = (charSum % 800) + 200;
    const friendDiv = getDivisionInfo(friendXp).name;

    const newFriendObj = {
      id: `friend_${emailClean}_${charSum}`,
      name: emailClean.split('@')[0],
      email: emailClean,
      xp: friendXp,
      streak: (charSum % 7) + 1,
      division: friendDiv
    };

    const updatedFriends = [...friends, newFriendObj];
    setFriends(updatedFriends);
    saveGamificationData({ ...gamification, friends: updatedFriends });
    setNewFriendEmail('');
    setNotice(`Added ${newFriendObj.name} to your Sprint League!`);
    setTimeout(() => setNotice(''), 3500);
  };

  const handleSendKudos = (friendId, friendName) => {
    setKudosSent(prev => ({ ...prev, [friendId]: true }));
    toast.success(`Sent 👏 Kudos to ${friendName}!`);
  };

  return (
    <div className="glass-card-cosmic p-4 p-md-5 mb-4" style={{ borderRadius: '24px', borderLeft: `5px solid ${currentDivision.color}` }}>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        
        {/* Division Header */}
        <div className="d-flex align-items-center gap-3">
          <div 
            className="p-3 d-flex align-items-center justify-content-center"
            style={{
              background: currentDivision.bg,
              color: currentDivision.color,
              border: `1px solid ${currentDivision.border}`,
              borderRadius: '16px',
              fontSize: '1.5rem'
            }}
          >
            {currentDivision.icon}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-white mb-0" style={{ fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
                Weekly Sprint League
              </h3>
              <span 
                className="px-2.5 py-0.5 font-bold text-uppercase"
                style={{
                  fontSize: '0.68rem',
                  background: currentDivision.bg,
                  color: currentDivision.color,
                  border: `1px solid ${currentDivision.border}`,
                  borderRadius: '9999px'
                }}
              >
                {currentDivision.name}
              </span>
            </div>
            <p className="m-0 mt-0.5" style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
              Top 3 students get promoted at the end of the week. Earn XP to climb rankings!
            </p>
          </div>
        </div>

        {/* Add Friend Form */}
        <form onSubmit={handleAddFriend} className="d-flex align-items-center gap-2">
          <input
            type="email"
            placeholder="Search student email..."
            value={newFriendEmail}
            onChange={(e) => setNewFriendEmail(e.target.value)}
            className="form-control px-3 py-2 font-semibold"
            style={{ fontSize: '0.86rem', maxWidth: '220px' }}
          />
          <button
            type="submit"
            className="btn btn-outline px-3 py-2 font-bold d-flex align-items-center gap-1.5"
            style={{ fontSize: '0.86rem' }}
          >
            <UserPlus size={15} /> Add
          </button>
        </form>
      </div>

      {notice && (
        <div className="p-2.5 mb-3 text-center font-bold text-success" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', fontSize: '0.84rem' }}>
          <UserCheck size={16} className="me-1" /> {notice}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="table-responsive">
        <table className="table table-leaderboard align-middle m-0" style={{ background: 'transparent' }}>
          <thead>
            <tr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th scope="col" className="text-subtext" style={{ width: '65px' }}>Rank</th>
              <th scope="col" className="text-subtext">Sprint Student</th>
              <th scope="col" className="text-subtext">Division</th>
              <th scope="col" className="text-subtext text-center">Streak</th>
              <th scope="col" className="text-subtext text-end">Weekly XP</th>
              <th scope="col" className="text-subtext text-center" style={{ width: '90px' }}>Kudos</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardList.map((item, index) => {
              const rank = index + 1;
              const isLead = item.isLead || item.isCoLead;
              const isPromoted = rank <= 3;
              const divMeta = getDivisionInfo(item.xp);

              return (
                <tr 
                  key={item.id || index}
                  className="transition-all"
                  style={{
                    background: item.isCurrentUser ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    borderColor: 'rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <td className="fw-bold">
                    {rank === 1 ? (
                      <span className="badge bg-warning text-dark font-black" style={{ borderRadius: '9999px' }}>🥇 #1</span>
                    ) : rank === 2 ? (
                      <span className="badge bg-secondary text-white font-black" style={{ borderRadius: '9999px' }}>🥈 #2</span>
                    ) : rank === 3 ? (
                      <span className="badge font-black" style={{ background: '#CD7F32', color: '#fff', borderRadius: '9999px' }}>🥉 #3</span>
                    ) : (
                      <span className="font-mono text-subtext">#{rank}</span>
                    )}
                  </td>

                  <td>
                    <div className="d-flex align-items-center gap-2.5">
                      {item.avatar ? (
                        <img src={item.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center font-bold text-white"
                          style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366F1, #06B6D4)', borderRadius: '50%', fontSize: '0.8rem' }}
                        >
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="d-flex align-items-center gap-1.5">
                          <span className={`fw-bold ${item.isCurrentUser ? 'text-cyan-400' : 'card-title-text'}`} style={{ fontSize: '0.9rem' }}>
                            {item.name}
                          </span>
                          {isLead && (
                            <span className="badge bg-primary text-white font-mono" style={{ fontSize: '0.6rem', borderRadius: '9999px' }}>
                              MAINTAINER
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.78rem', color: divMeta.color, fontWeight: 600 }}>
                      {divMeta.icon} {divMeta.name}
                    </span>
                  </td>

                  <td className="text-center font-bold" style={{ color: '#F97316', fontSize: '0.86rem' }}>
                    <Flame size={15} className="me-1 d-inline" />
                    {item.streak || 1}d
                  </td>

                  <td className="text-end font-mono font-black" style={{ color: '#EAB308', fontSize: '0.95rem' }}>
                    <Zap size={15} className="me-1 d-inline" />
                    {(item.xp || 0).toLocaleString()} XP
                  </td>

                  <td className="text-center">
                    {!item.isCurrentUser && (
                      <button
                        onClick={() => handleSendKudos(item.id, item.name)}
                        disabled={kudosSent[item.id]}
                        className="btn btn-ghost btn-sm p-1"
                        title="Send Kudos!"
                        style={{ color: kudosSent[item.id] ? '#34D399' : '#94A3B8' }}
                      >
                        {kudosSent[item.id] ? '👏 Sent' : '👏 Cheers'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
