import { ApolloServer,gql } from "apollo-server";

let fakeTweets = [
    {
        id:'1',
        text: "hello",
        userId : "2",
    },
    {
        id:'2',
        text: "hello world",
        userId : "1",
    },
    {
        id:'3',
        text: "bye",
        userId: "3"
    }
]

let fakeUsers = [
    {
        id:'1',
        username:"ddol",
        firstname :"ddol",
        lastname : "chiwawa"
    },
    {
        id:'2',
        username:"dog",
        firstname : "hot",
        lastname : "dog"
    },
    {
        id:"3",
        username:"chiwawa",
        firstname : "black",
        lastname : "chiwawa"
    }
]

const typeDefs = gql`
    type User{
        id:ID!
        username:String!,
        firstname: String!,
        lastname:String!
        """
        fullName is Sum of first name and lastname
        which is derived from database
        """
        fullName: String!
    }
    """
    Tweet Object represent a resource for a Tweet
    """
    type Tweet{
        id:ID!
        text:String!,
        author: User,
    }

    type Query{
        allTweets: [Tweet!]
        tweet(id:ID!): Tweet
        allUsers: [User!]!
    }
    type Mutation{
        postTweet(text:String!, userId: ID!): Tweet!
        deleteTweet(id:ID!):Boolean!
    }
`

const resolvers = {
    Query:{
        tweet(root,{id}) {
            console.log(id);
            return fakeTweets.find((tweet) => tweet.id ===  id)
        },
        allTweets(){
            return fakeTweets;
        },
        allUsers(){
            console.log("allUsers called!")
            return fakeUsers;
        }
    },
    Mutation:{
        postTweet(_,{text,userId}){
            const newTweet = {
                id: fakeTweets.length+ 1,
                text
            };
            fakeTweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_,{id}){
            const tweet = fakeTweets.find(tweet => tweet.id === id);
            if(!tweet) return false;
            fakeTweets = fakeTweets.filter(tweet => tweet.id !== id);
            return true;
        }
    },
    User:{
        fullName({firstname,lastname}){
            return `${firstname} ${lastname}`
        }
    },
    Tweet:{
        author({userId}){
            return fakeUsers.find(user => user.id === userId);
        }
    }
}

const server = new ApolloServer({typeDefs,resolvers});

server.listen().then(({url})=>console.log(`Running on ${url}`));