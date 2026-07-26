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
    <div className="neo-brutal-card p-4 p-md-5 mb-4 shadow-hard font-mono" style={{ background: 'var(--bg-main)' }}>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 border-b-brutal pb-3">
        
        {/* Division Header */}
        <div className="d-flex align-items-center gap-3">
          <div className="w-12 h-12 border-brutal flex items-center justify-center font-bold text-2xl" style={{ width: '48px', height: '48px', background: 'var(--brand)', color: '#FFFFFF' }}>
            {currentDivision.icon}
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h3 className="font-headline text-3xl font-black uppercase italic m-0" style={{ color: 'var(--text-main)' }}>
                GLOBAL STANDINGS_
              </h3>
              <span className="bg-brand text-white font-bold px-2 py-0.5 border-brutal text-xs uppercase">
                {currentDivision.name}
              </span>
            </div>
            <p className="m-0 font-bold text-xs uppercase mt-1" style={{ color: 'var(--text-muted)' }}>
              TOP 3 STUDENTS GET PROMOTED TO THE NEXT TIER AT THE END OF THE SPRINT WEEK.
            </p>
          </div>
        </div>

        {/* Add Operative Form */}
        <form onSubmit={handleAddFriend} className="d-flex align-items-center gap-2">
          <input
            type="email"
            placeholder="OPERATIVE EMAIL..."
            value={newFriendEmail}
            onChange={(e) => setNewFriendEmail(e.target.value)}
            className="border-brutal p-2 font-bold text-xs uppercase outline-none focus:bg-brand"
            style={{ maxWidth: '200px', background: 'var(--bg-main)', color: 'var(--text-main)' }}
          />
          <button
            type="submit"
            className="bg-black text-white border-2 border-black px-3 py-2 font-headline font-black text-xs uppercase hover:bg-brand hover:text-black transition-all"
          >
            + ADD
          </button>
        </form>
      </div>

      {notice && (
        <div className="p-2 mb-3 text-center font-bold bg-brand text-black border-2 border-black text-xs uppercase">
          ✓ {notice}
        </div>
      )}

      {/* Standings Table */}
      <div className="table-responsive">
        <table className="table table-bordered border-brutal align-middle m-0 font-mono" style={{ '--bs-table-bg': 'transparent' }}>
          <thead className="border-b-brutal" style={{ background: 'var(--bg-main)' }}>
            <tr className="font-headline text-xs font-black uppercase">
              <th scope="col" className="p-3" style={{ color: 'var(--text-main)' }}>POS</th>
              <th scope="col" className="p-3" style={{ color: 'var(--text-main)' }}>OPERATIVE</th>
              <th scope="col" className="p-3 text-center" style={{ color: 'var(--text-main)' }}>STREAK</th>
              <th scope="col" className="p-3 text-end" style={{ color: 'var(--text-main)' }}>WEEKLY XP</th>
              <th scope="col" className="p-3 text-center" style={{ color: 'var(--text-main)' }}>KUDOS</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardList.map((item, index) => {
              const rank = index + 1;
              const isLead = item.isLead || item.isCoLead;

              return (
                <tr 
                  key={item.id || index}
                  className={item.isCurrentUser ? 'font-bold' : ''}
                  style={{ 
                    background: item.isCurrentUser ? 'var(--brand)' : 'var(--bg-card)', 
                    color: item.isCurrentUser ? '#FFFFFF' : 'var(--text-main)',
                    borderBottom: '2px solid var(--border-main)' 
                  }}
                >
                  <td className="p-3 font-headline font-black text-base" style={{ color: item.isCurrentUser ? '#FFFFFF' : 'var(--text-main)' }}>
                    #{String(rank).padStart(2, '0')}
                  </td>

                  <td className="p-3 font-bold text-sm" style={{ color: item.isCurrentUser ? '#FFFFFF' : 'var(--text-main)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="uppercase">{item.name}</span>
                      {isLead && (
                        <span className="bg-brand text-white px-1.5 py-0.5 text-[10px] font-black border-brutal">
                          MAINTAINER
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3 text-center font-bold">
                    <span>
                      <span style={{ color: '#F59E0B' }}>🔥</span> 
                      <span style={{ color: item.isCurrentUser ? '#FFFFFF' : 'var(--text-main)' }}> {item.streak || 1}D</span>
                    </span>
                  </td>

                  <td className="p-3 text-end font-headline font-black text-lg" style={{ color: item.isCurrentUser ? '#FFFFFF' : 'var(--text-main)' }}>
                    {(item.xp || 0).toLocaleString()}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleSendKudos(item.id || index, item.name)}
                      disabled={kudosSent[item.id || index]}
                      className="bg-black text-brand border border-black px-2.5 py-1 font-bold text-xs hover:bg-white hover:text-black transition-all"
                    >
                      {kudosSent[item.id || index] ? '👏 SENT' : '👏 KUDOS'}
                    </button>
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
