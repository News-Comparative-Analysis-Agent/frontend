
async function check93() {
  const issueId = '93';
  const url = `http://209.38.76.211:8000/issues/${issueId}/draft`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('--- Root Keys ---');
    console.log(Object.keys(data));
    
    let draft = data.pre_generated_draft;
    if (typeof draft === 'string') {
      draft = JSON.parse(draft);
    }
    
    console.log('--- Draft Keys ---');
    console.log(Object.keys(draft));
    
    if (draft.media_views) {
      console.log('Draft has media_views:', draft.media_views.length);
    } else {
      console.log('Draft MISSING media_views');
    }
    
    if (data.media_views) {
      console.log('Root has media_views:', data.media_views.length);
    }
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}

check93();
