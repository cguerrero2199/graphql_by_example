import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { getAccessToken } from '../auth';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

const client = new ApolloClient({
    uri: GRAPHQL_URL,
    cache: new InMemoryCache()
});

export async function getJobs() {
    const query = gql`
        query {
            jobs {
                id
                title
                company {
                    name
                }
            }
        }
    `;
    //destructing nested objects
    const { data: { jobs }} = await client.query({ query });
    return jobs; 
}

export async function getJob(id) {
    const query = gql`
        query JobQuery($id: ID!) {
            job(id: $id) {
                id
                title
                company {
                    id
                    name
                }
                description
            }
        }
    `;

    const vars = { id }
    const { data: { job} }= await client.query({ query, vars });
    return job;
}

export async function getCompany(id) {
    const query = gql`
        query CompanyQuery($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    title
                }
            }
        }
    `;

    const vars = { id }
    const { data: { company } } = await client.query({ query, vars });
    return company;
}

export async function createJob(input) {
    const mutation = gql`
        mutation CreateJobMutation($input: CreateJobInput!) {
            job: createJob(input: $input) {
                id 
            }
        }
    `;

    const vars = { input }
    const context = {
        headers: { 'Authorization': 'Bearer ' + getAccessToken() }
    }
    const { data: { job } } = await client.mutate({ mutation, vars, context });
    return job;
}