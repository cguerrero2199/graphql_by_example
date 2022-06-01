import { Company, Job } from './db.js';

export const resolvers = {
    Query: {
        job: (_root, { id }) => Job.findById(id),
        jobs: async () => Job.findAll(),
        company: (_root, { id }) => Company.findById(id)
    },

    Mutation: {
        createJob: (_root, { input }, { user }) => { 

            if(!user){
                throw new Error('UNAUTHORIZED');
            }

            return Job.create({ ...input, companyId: user.companyId}) 
        },

        deleteJob: async (_root, { id }, { user }) => {
            if(!user) {
                throw new Error ('UNAUTHORIZED');
            }
            const job =  await Job.findById(id);

            if(user.companyId != job.companyId) {
                throw new Error ('UNAUTHORIZED');
            }

            return Job.delete(id)
        },

        updateJob: async (_root, { input }, { user }) => {
            if(!user) {
                throw new Error ('UNAUTHORIZED');
            }
            const job =  await Job.findById(input.id);

            if(user.companyId != job.companyId) {
                throw new Error ('UNAUTHORIZED');
            }

            return Job.update({...input, companyId:user.companyId});
        } 
    },

    Job: {
        company: (job) => {
            return Company.findById(job.companyId);
        }
    },

    Company: {
        jobs: (company) => Job.findAll((job) => job.companyId === company.id)
    }
};