import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField, Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../Iconify';
import { editUser } from '../../services/auth';

import useResponsive from '../../theme/hooks/useResponsive';
import PropTypes from 'prop-types';
import AlertBanner from '../AlertBanner';

// ----------------------------------------------------------------------

EditForm.propTypes = {
  hideEditUser: PropTypes.func,
  emailId: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  showHomeAlert: PropTypes.func,
  homeAlertMessage: PropTypes.string,
};

export default function EditForm({ hideEditUser, emailId, firstName, lastName, showHomeAlert, homeAlertMessage }) {
  const smUp = useResponsive('up', 'sm');

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(" ");

  const EditSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      emailId: emailId,
      firstName: firstName,
      lastName: lastName,
    },
    validationSchema: EditSchema,
    onSubmit: async (values, { setValues }) => {
      // User Edit Service call - Upon success user is redirected to dashboard
      // Edit fail snackbar displays error
      const update_response = await editUser(values, setShowAlert, setAlertMessage, showHomeAlert, homeAlertMessage);
      if (update_response) {
        // Update local storage with new user information
        const updatedProfile = { ...JSON.parse(localStorage.getItem('profile')), ...values };
        localStorage.setItem('profile', JSON.stringify(updatedProfile));
        // Update form values
        setValues(updatedProfile);
        hideEditUser();
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <AlertBanner showAlert={showAlert} alertMessage={alertMessage} severity='error' />
            <Stack spacing={3} direction="row" alignItems="center" justifyContent="space-between">
              <TextField
                name="firstName"
                fullWidth
                type="text"
                label="First Name"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <TextField
                name="lastName"
                fullWidth
                type="text"
                label="Last Name"
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Stack>
          </Stack>
          <Grid container spacing={2} mt={2} justifyContent={'center'}>
            <Grid item md={6} xs={11}>
              <Button
                startIcon={<Iconify icon='material-symbols:cancel' />}
                size="large"
                onClick={hideEditUser}
                variant="outlined"
                color={'error'}
                sx={{ width: '100%' }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item md={6} xs={11}>
              <LoadingButton
                startIcon={<Iconify icon='teenyicons:tick-circle-solid' />}
                fullWidth
                size="large"
                type='submit'
                variant="outlined"
                loading={isSubmitting}
              >
                Update
              </LoadingButton>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </>
  );
}
