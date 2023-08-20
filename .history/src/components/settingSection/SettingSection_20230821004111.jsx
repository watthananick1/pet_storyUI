import React from 'react'
import Drawerbar from './Drawer'


export default function SettingSection() {
  return (
    <div>
      <Drawerbar />
      <Container
          sx={{
            mt: 4,
            mb: 4,
            flexGrow: 1,
            height: "100vh",
            overflow: open ? "hidden" : "auto",
            maxWidth: open ? "100%" : "lg",
          }}
        >
          {content}
          <Copyright sx={{ pt: 4 }} />
        </Container>
    </div>
  )
}
