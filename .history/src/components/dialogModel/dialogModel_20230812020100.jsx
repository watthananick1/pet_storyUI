import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Send as SendIcon } from "@mui/icons-material";
import { ReactCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import LoadingButton from "@mui/lab/LoadingButton";
import { Messageupdate } from "../../context/AuthActions";
import { AuthContext } from "../../context/AuthContext";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();
const firestore = firebase.firestore();
const path = process.env.REACT_APP_PATH_ID;

export default function FilePreviewer({ onClose }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const profileSize = 200;
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });

  const cropperRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
    };
  }, []);

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCancel = () => {
    setImagePreview(null);
    handleClose();
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

  const getCroppedProfileImageBlob = async (sourceImageUrl, crop, profileSize) => {
    const image = new Image();
    image.src = sourceImageUrl;
  
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        const scaleRatio = Math.max(image.width / crop.width, image.height / crop.height);
        const scaledWidth = crop.width * scaleRatio;
        const scaledHeight = crop.height * scaleRatio;
  
        // Calculate the new dimensions and positions
        const newWidth = scaledWidth < profileSize ? scaledWidth : profileSize;
        const newHeight = scaledHeight < profileSize ? scaledHeight : profileSize;
        const offsetX = (scaledWidth - newWidth) / 2;
        const offsetY = (scaledHeight - newHeight) / 2;
  
        canvas.width = profileSize;
        canvas.height = profileSize;
  
        ctx.drawImage(
          image,
          crop.x * scaleRatio + offsetX,
          crop.y * scaleRatio + offsetY,
          newWidth,
          newHeight,
          0,
          0,
          profileSize,
          profileSize
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
    <div>
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
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
                <ReactCrop crop={crop} onChange={handleCropChange}>
                  <img src={imagePreview} alt="Preview" />
                </ReactCrop>
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <LoadingButton
            onClick={handleAvatarUpload}
            variant="outlined"
            color="success"
            startIcon={<SendIcon />}
            className="shareButton"
            loading={loading}
            disabled={loading}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
