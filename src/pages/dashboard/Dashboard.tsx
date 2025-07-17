import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  Description as DescriptionIcon,
  AccountTree as AccountTreeIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { selectAuth } from '../../store/slices/authSlice';

const Dashboard: React.FC = () => {
  const { user } = useSelector(selectAuth);

  const cards = [
    {
      title: 'Tenants',
      icon: <BusinessIcon sx={{ fontSize: 40 }} color="primary" />,
      count: 5,
      path: '/tenants',
    },
    {
      title: 'Users',
      icon: <PeopleIcon sx={{ fontSize: 40 }} color="primary" />,
      count: 25,
      path: '/users',
    },
    {
      title: 'Data Models',
      icon: <StorageIcon sx={{ fontSize: 40 }} color="primary" />,
      count: 12,
      path: '/data-models',
    },
    {
      title: 'Forms',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} color="primary" />,
      count: 18,
      path: '/forms',
    },
    {
      title: 'Workflows',
      icon: <AccountTreeIcon sx={{ fontSize: 40 }} color="primary" />,
      count: 8,
      path: '/workflows',
    },
  ];

  return (
    <Box className="page-container">
      <Box className="page-header">
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Welcome back, {user?.firstName} {user?.lastName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your platform.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    {card.icon}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={card.title}
                subheader={`Total: ${card.count}`}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Manage your {card.title.toLowerCase()} and configure settings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              No recent activity to display.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;