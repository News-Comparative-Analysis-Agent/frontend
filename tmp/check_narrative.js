
async function checkNarrative93() {
  const issueId = '93';
  const url = `http://209.38.76.211:8000/issues/${issueId}/draft`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    let draft = data.pre_generated_draft;
    if (typeof draft === 'string') draft = JSON.parse(draft);
    
    console.log('--- Media Views Narrative ---');
    draft.media_views?.forEach(v => {
      console.log(`[${v.press}]: ${v.narrative}`);
    });
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}

checkNarrative93();
