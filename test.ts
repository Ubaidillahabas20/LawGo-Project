async function test() {
  const res = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'ini sewa rumah' }),
  });
  const data = await res.json();
  console.log("Analyze:", data);
  
  if (data.job_id) {
    let status = 'PROCESSING';
    while (status === 'PROCESSING' || status === 'PENDING') {
      await new Promise(r => setTimeout(r, 1000));
      const statusRes = await fetch(`http://localhost:3000/api/result/${data.job_id}`);
      const statusData = await statusRes.json();
      console.log("Status:", statusData);
      status = statusData.status;
    }
  }
}
test();
