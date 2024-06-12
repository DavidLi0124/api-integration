const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const crmRoutes = require('./routes/crmRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/crm', crmRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





