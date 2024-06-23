import React, { useEffect, useState } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Box,
  TextField,
  InputAdornment,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import supabase from '../Services/Supabase';

const verticalLine = {
  border: '1px solid rgba(224, 224, 224, 1)'
};

const PatientLists = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  // Get today's date in the format yyyy-mm-dd
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0!
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [newPatient, setNewPatient] = useState({
    patientnumber: '',
    clinicnumber: '',
    appointmentnumber: '',
    firstname: '',
    lastname: '',
    address: '',
    telephonenumber: '',
    dateofbirth: '',
    sex: '',
    maritalstatus: '',
    dateregistered: getTodayDate() // Set default value to today's date
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) {
        console.error('Error fetching patient lists:', error.message);
        return;
      }
      setPatients(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching patient lists', error.message);
    }
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([newPatient]);
      if (error) {
        console.error('Error saving patient:', error.message);
        return;
      }
      fetchPatients();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving patient:', error.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPatient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientnumber.toString().includes(searchQuery) ||
    patient.clinicnumber.toString().includes(searchQuery)
  );

  return (
    <TableContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography component="h6" variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Patient lists
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={handleOpenDialog}
        >
          Add Registration
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ ml: 2, borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
            },
          }}
        />
        
      </Box>
      <Divider sx={{ mb: 2 }} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={verticalLine}>Patient number</TableCell>
              <TableCell sx={verticalLine}>Clinic number</TableCell>
              <TableCell sx={verticalLine}>Appointment number</TableCell>
              <TableCell sx={verticalLine}>First name</TableCell>
              <TableCell sx={verticalLine}>Last name</TableCell>
              <TableCell sx={verticalLine}>Address</TableCell>
              <TableCell sx={verticalLine}>Telephone number</TableCell>
              <TableCell sx={verticalLine}>Date of birth</TableCell>
              <TableCell sx={verticalLine}>Sex</TableCell>
              <TableCell sx={verticalLine}>Marital Status</TableCell>
              <TableCell sx={verticalLine}>Date registered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.patientnumber}>
                <TableCell sx={verticalLine}>{patient.patientnumber}</TableCell>
                <TableCell sx={verticalLine}>{patient.clinicnumber}</TableCell>
                <TableCell sx={verticalLine}>{patient.appointmentnumber}</TableCell>
                <TableCell sx={verticalLine}>{patient.firstname}</TableCell>
                <TableCell sx={verticalLine}>{patient.lastname}</TableCell>
                <TableCell sx={verticalLine}>{patient.address}</TableCell>
                <TableCell sx={verticalLine}>{patient.telephonenumber}</TableCell>
                <TableCell sx={verticalLine}>{patient.dateofbirth}</TableCell>
                <TableCell sx={verticalLine}>{patient.sex}</TableCell>
                <TableCell sx={verticalLine}>{patient.maritalstatus}</TableCell>
                <TableCell sx={verticalLine}>{patient.dateregistered}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle >Add Patient Registration</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6} >
              <TextField
                fullWidth
                variant="outlined"
                label="Patient Number"
                name="patientnumber"
                value={newPatient.patientnumber}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Clinic Number"
                name="clinicnumber"
                value={newPatient.clinicnumber}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Appointment Number"
                name="appointmentnumber"
                value={newPatient.appointmentnumber}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="First Name"
                name="firstname"
                value={newPatient.firstname}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Last Name"
                name="lastname"
                value={newPatient.lastname}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Address"
                name="address"
                value={newPatient.address}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Telephone Number"
                name="telephonenumber"
                value={newPatient.telephonenumber}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Date of Birth"
                name="dateofbirth"
                type= "date"
                value={newPatient.dateofbirth}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Sex"
                name="sex"
                value={newPatient.sex}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                select
              >
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Marital Status"
                name="maritalstatus"
                value={newPatient.maritalstatus}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                select
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Date Registered"
                name="dateregistered"
                type="date"
                value={newPatient.dateregistered}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default PatientLists;
