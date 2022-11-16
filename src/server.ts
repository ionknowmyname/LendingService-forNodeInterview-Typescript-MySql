import express from 'express';
import routes from './routes'; 


export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});