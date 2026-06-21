import React, { useState } from 'react';
import PasswordGate from '../features/contentManager/components/PasswordGate';
import ContentManager from '../features/contentManager/components/ContentManager';

export default function ContentManagerPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return <ContentManager />;
}
