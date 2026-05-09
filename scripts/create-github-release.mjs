#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const owner = 'linkiez';
const repo = 'BoletoSDK';
const tag = 'v1.0.0';
const title = 'v1.0.0 - Brazilian Bank Slip SDK Stable Release';
const releaseNotesPath = 'doc/RELEASE-NOTES-1.0.0.md';

const releaseNotes = fs.readFileSync(releaseNotesPath, 'utf-8');

// Get GitHub token from git config or environment
const getGitHubToken = () => {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    throw new Error('GitHub token not found. Set GITHUB_TOKEN or GH_TOKEN environment variable.');
  }
  return token;
};

const createRelease = async () => {
  try {
    const token = getGitHubToken();
    const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js Release Script'
      },
      body: JSON.stringify({
        tag_name: tag,
        name: title,
        body: releaseNotes,
        draft: false,
        prerelease: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub API Error:', data);
      process.exit(1);
    }

    console.log('✅ GitHub Release created successfully!');
    console.log(`📦 Release URL: ${data.html_url}`);
  } catch (error) {
    console.error('❌ Error creating release:', error.message);
    process.exit(1);
  }
};

createRelease();
