export default{
    JWTSecret: process.env.JWT_SECRET || 'secreto',
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb+srv://thegodlessman:8TXqQS0NeBgtgxq9@cluster.z8qs0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster', 
        USER: process.env.MONGODB_USER  || '', 
        PASSWORD: process.env.MONGODB_PASSWORD || ''
    }
}