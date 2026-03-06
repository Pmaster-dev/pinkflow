DAO Governance System
export const daoFlow = {
  async createProposal(proposal) {
    const validated = await deafAuthFlow.validateIdentity(proposal.creator);
    if (!validated) throw new Error('Identity validation required');
    
    const proposalData = {
      id: crypto.randomUUID(),
      title: proposal.title,
      description: proposal.description,
      type: proposal.type, // 'deployment' | 'policy' | 'treasury'
      creator: proposal.creator,
      votingPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
      requiredQuorum: 0.3,
      status: 'active'
    };
    
    await fetch('/api/dao/proposal', {
      method: 'POST',
      body: JSON.stringify(proposalData)
    });
    
    return proposalData;
  },
  
  async vote(proposalId, vote, voter) {
    const reputation = await this.getReputation(voter);
    const votingPower = this.calculateVotingPower(reputation);
    
    return fetch('/api/dao/vote', {
      method: 'POST',
      body: JSON.stringify({
        proposalId,
        vote, // 'for' | 'against' | 'abstain'
        voter,
        power: votingPower
      })
    });
  },
  
  calculateVotingPower(reputation) {
    // Community over credentials
    return Math.sqrt(reputation.trustScore) * reputation.contributions;
  },
  
  async getReputation(userId) {
    const response = await fetch(`/api/fibonrose/reputation?user=${userId}`);
    return response.json();
  }
};