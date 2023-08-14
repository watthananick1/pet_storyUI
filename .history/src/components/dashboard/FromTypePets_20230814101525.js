import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Stack from '@mui/material/Stack';


const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function FromTypePets() {
  const [imagePreview, setImagePreview] = useState(null);
  const profileSize = 200;
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  
  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCancel = () => {
    setImagePreview(null);
  };

  const previewFile = (e) => {
    const reader = new FileReader();
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
    }
  };
  
  const getCroppedProfileImageBlob = async (
    sourceImageUrl,
    crop,
    profileSize
  ) => {
    const image = new Image();
    image.src = sourceImageUrl;

    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const scaleRatioX = image.width / crop.width; // Calculate scale ratio in X-axis
        const scaleRatioY = image.height / crop.height; // Calculate scale ratio in Y-axis

        const scaledWidth = crop.width * scaleRatioX;
        const scaledHeight = crop.height * scaleRatioY;

        // Calculate the new dimensions and positions
        const newWidth = scaledWidth < image.width ? scaledWidth : image.width;
        const newHeight =
          scaledHeight < image.height ? scaledHeight : image.height;
        const offsetX = (image.width - newWidth) / 2; // Calculate center offset on X-axis
        const offsetY = (image.height - newHeight) / 2; // Calculate center offset on Y-axis

        canvas.width = newWidth; // Set canvas width to the new width
        canvas.height = newHeight; // Set canvas height to the new height

        ctx.drawImage(
          image,
          crop.x * scaleRatioX,
          crop.y * scaleRatioY,
          crop.width * scaleRatioX,
          crop.height * scaleRatioY,
          offsetX,
          offsetY,
          newWidth,
          newHeight
        );

        canvas.toBlob((blob) => {
          resolve(blob); // Return the cropped Blob
        }, "image/jpeg");
      };
    });
  };
  
  const handleAvatarUpload = async () => {
    setLoading(true);

    try {
      const storageRef = storage.ref();
      const fileName = `${Date.now()}_profile`;
      const fileRef = storageRef.child(
        `${user.member_id}/profilePicture/${fileName}`
      );

      if (!imagePreview) {
        throw new Error("No image selected");
      }

      const croppedImageBlob = await getCroppedProfileImageBlob(
        imagePreview,
        crop,
        profileSize
      );

      if (!croppedImageBlob) {
        throw new Error("Error cropping image");
        dispatch(Messageupdate("Error cropping image.", true, "error"));
      }

      const file = new File([croppedImageBlob], fileName, {
        type: "image/jpeg",
      });

      const uploadTaskSnapshot = await fileRef.put(file);

      const downloadUrl = await uploadTaskSnapshot.ref.getDownloadURL();

      await firestore.collection("Users").doc(user.member_id).update({
        profilePicture: downloadUrl,
      });

      onClose();
    } catch (error) {
      dispatch(
        Messageupdate("Error uploading profile picture.", true, "error")
      );
    } finally {
      dispatch(
        Messageupdate("Profile picture updated successfully.", true, "success")
      );
      setLoading(false);
    }
  };
  
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "100%" },
      }}
      noValidate
      autoComplete="off"
      xs={12} 
      md={8}
    >
      <Paper
        sx={{
          p: 2,
        }}
      >
        <FormGroup>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Name Type"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Name Type"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 240,
                }}
              >
                        <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <input
                accept="image/png, image/jpeg, image/jpg"
                onChange={previewFile}
                ref={cropperRef}
                type="file"
                hidden
              />

              <Button
                variant="outlined"
                className="btn"
                startIcon={<AddAPhotoIcon />}
                onClick={() => cropperRef.current.click()}
              >
                Choose
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
              {imagePreview && (
                <ReactCrop crop={crop} locked={true} onChange={handleCropChange}>
                  <img src={imagePreview} alt="Preview" />
                </ReactCrop>
              )}
            </Stack>
          </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <FormControlLabel
                control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                label="Status Type"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Button
                fullWidth
                sx={{display: "flex", justifyItems: "end"}}
                variant="contained"
                color="success"
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </FormGroup>
      </Paper>
    </Box>
  );
}
