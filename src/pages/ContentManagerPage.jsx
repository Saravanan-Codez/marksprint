import React, { useState } from 'react';
import PasswordGate from '../features/contentManager/components/PasswordGate';
import ContentManager from '../features/contentManager/components/ContentManager';
import ClickSpark from '../components/ClickSpark';

export default function ContentManagerPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return (
      <ClickSpark isDark={true}>
        <PasswordGate onUnlock={() => setIsUnlocked(true)} />
      </ClickSpark>
    );
  }

  return (
    <ClickSpark isDark={true}>
      <ContentManager />
    </ClickSpark>
  );
}
