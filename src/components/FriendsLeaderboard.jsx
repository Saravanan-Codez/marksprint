import React, { useState } from 'react';
import { Trophy, Flame, Zap, UserPlus, ShieldAlert, Award, UserCheck } from 'lucide-react';
import { getLocalGamificationData, saveGamificationData } from '../services/gamificationService';
import { useAuth } from '../context/useAuth';

export default function FriendsLeaderboard() {
  const { user, userProfile } = useAuth();
  const gamification = getLocalGamificationData();
  const [friends, setFriends] = useState(gamification.friends || []);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [notice, setNotice] = useState('');

  const currentUserDisplayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'You';
  const userXp = gamification.xp || 0;
  const userStreak = gamification.streakDays || 1;

  // Build combined leaderboard array
  const leaderboardList = [
    {
      id: 'current_user',
      name: `${currentUserDisplayName} (You)`,
      xp: userXp,
      streak: userStreak,
      isCurrentUser: true,
      avatar: gamification.customAvatarUrl || user?.photoURL,
    },
    ...friends,
  ].sort((a, b) => b.xp - a.xp);

  const handleAddFriend = (e) => {
    e.preventDefault();
    const emailClean = newFriendEmail.trim();
    if (!emailClean) return;

    let charSum = 0;
    for (let i = 0; i < emailClean.length; i++) {
      charSum += emailClean.charCodeAt(i);
    }
    const newFriendObj = {
      id: `friend_${emailClean}_${charSum}`,
      name: emailClean.split('@')[0],
      email: emailClean,
      xp: (charSum % 400) + 150,
      streak: (charSum % 5) + 1,
    };

    const updatedFriends = [...friends, newFriendObj];
    setFriends(updatedFriends);
    saveGamificationData({ ...gamification, friends: updatedFriends });
    setNewFriendEmail('');
    setNotice(`Added ${newFriendObj.name} to your friends leaderboard!`);
    setTimeout(() => setNotice(''), 3500);
  };

  return (
    <div className="glass-card-cosmic p-4 p-md-5 mb-4" style={{ borderRadius: '0px', borderLeft: '4px solid #EAB308' }}>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="p-2.5 d-flex align-items-center justify-content-center"
            style={{
              background: 'rgba(234, 179, 8, 0.15)',
              color: '#EAB308',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '0px'
            }}
          >
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-white mb-0" style={{ fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
              Duolingo-Style Friends Leaderboard
            </h3>
            <p className="m-0 mt-0.5" style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              Compete weekly with maintainers & friends. Earn XP to climb ranks!
            </p>
          </div>
        </div>

        {/* Add Friend Form */}
        <form onSubmit={handleAddFriend} className="d-flex align-items-center gap-2">
          <input
            type="email"
            placeholder="Friend's Email..."
            value={newFriendEmail}
            onChange={(e) => setNewFriendEmail(e.target.value)}
            className="form-control cosmic-input px-3 py-1.5 font-semibold"
            style={{ fontSize: '0.84rem', borderRadius: '0px', maxWidth: '200px' }}
          />
          <button
            type="submit"
            className="btn btn-cosmic-outline px-3 py-1.5 font-bold d-flex align-items-center gap-1.5"
            style={{ borderRadius: '0px', fontSize: '0.84rem' }}
          >
            <UserPlus size={15} /> Add
          </button>
        </form>
      </div>

      {notice && (
        <div className="p-2.5 mb-3 text-center font-bold text-success" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0px', fontSize: '0.82rem' }}>
          <UserCheck size={16} className="me-1" /> {notice}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle m-0" style={{ background: 'transparent' }}>
          <thead>
            <tr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8' }}>
              <th scope="col" style={{ width: '60px' }}>Rank</th>
              <th scope="col">Student</th>
              <th scope="col" className="text-center">Streak</th>
              <th scope="col" className="text-end">Weekly XP</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardList.map((item, index) => {
              const rank = index + 1;
              const isLead = item.isLead || item.isCoLead;

              return (
                <tr 
                  key={item.id || index}
                  style={{
                    background: item.isCurrentUser ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                    borderColor: 'rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <td className="fw-bold">
                    {rank === 1 ? (
                      <span className="badge bg-warning text-dark font-black" style={{ borderRadius: '0px' }}>🥇 #1</span>
                    ) : rank === 2 ? (
                      <span className="badge bg-secondary text-white font-black" style={{ borderRadius: '0px' }}>🥈 #2</span>
                    ) : rank === 3 ? (
                      <span className="badge font-black" style={{ background: '#CD7F32', color: '#fff', borderRadius: '0px' }}>🥉 #3</span>
                    ) : (
                      <span className="font-mono text-muted">#{rank}</span>
                    )}
                  </td>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {item.avatar ? (
                        <img src={item.avatar} alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '0px' }} />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center font-bold text-white"
                          style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '0px', fontSize: '0.75rem' }}
                        >
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span className={`fw-bold ${item.isCurrentUser ? 'text-cyan-400' : 'text-white'}`} style={{ fontSize: '0.88rem' }}>
                        {item.name}
                      </span>

                      {isLead && (
                        <span className="badge bg-primary text-white font-mono" style={{ fontSize: '0.62rem', borderRadius: '0px' }}>
                          MAINTAINER
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="text-center font-bold" style={{ color: '#F97316', fontSize: '0.85rem' }}>
                    <Flame size={15} className="me-1 d-inline" />
                    {item.streak}d
                  </td>

                  <td className="text-end font-mono font-black" style={{ color: '#EAB308', fontSize: '0.92rem' }}>
                    <Zap size={15} className="me-1 d-inline" />
                    {item.xp.toLocaleString()} XP
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
