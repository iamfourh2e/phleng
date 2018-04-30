<template>
    <div style="padding: 20px;">
        <el-row>
            <h1>Add Artist</h1>
        </el-row>
        <el-row justify="center">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
  <el-form-item label="Artist Kh Name" prop="khName">
    <el-input v-model="ruleForm.khName"></el-input>
  </el-form-item>
  <el-form-item label="Artist Name" prop="name">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="Artist Desc" prop="desc">
    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
  </el-form-item>
    <el-form-item label="Image" prop="image">
    <el-upload
  class="upload-demo"
  ref="upload"
  action="#"
  :limit=limit
  :file-list="fileList"
  :on-change="onUploadChange"
  :auto-upload="false"
  :on-success="onSuccess"
  >
  <el-button slot="trigger" size="small" type="primary">select file</el-button>
  <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 200kb</div>
</el-upload>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
    <el-button @click="resetForm('ruleForm')">Reset</el-button>
  </el-form-item>
</el-form>
        </el-row>
    </div>
</template>

<script>
import firebase from "../firebaseInit.js";
export default {
  data() {
    return {
      limit: 1,
      fileList: [],
      ruleForm: {
        khName: "",
        name: "",
        desc: ""
      },
      rules: {
        khName: [
          {
            required: true,
            message: "Please input Artist Kh name",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "Please input Artist name",
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            message: "Please input activity form",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let vm = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.date = new Date();
          firebase.db
            .collection("artists")
            .add(this.ruleForm)
            .then(snapshot => {
              let storageRef = firebase.storage.ref(
                snapshot.id + "/images"
              );
              vm.fileList.forEach(function(file) {
                vm.blobToDataURL(file.url, function(dataUrl) {
                  let uploadTask = storageRef
                    .child(file.name)
                    .putString(dataUrl, "data_url");
                  uploadTask.on(
                    "state_changed",
                    function(snapshot) {
                      // Observe state change events such as progress, pause, and resume
                      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                      var progress =
                        snapshot.bytesTransferred / snapshot.totalBytes * 100;
                      console.log("Upload is " + progress + "% done");
                      switch (snapshot.state) {
                        case firebase.storageState.PAUSED: // or 'paused'
                          console.log("Upload is paused");
                          break;
                        case firebase.storageState.RUNNING: // or 'running'
                          console.log("Upload is running " + progress);
                          break;
                      }
                    },
                    function(error) {
                      // Handle unsuccessful uploads
                    },
                    function() {
                      // Handle successful uploads on complete
                      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                      var downloadURL = uploadTask.snapshot.downloadURL;
                      firebase.db
                        .collection("artists")
                        .doc(snapshot.id)
                        .update("file_name",file.name,"image_url", downloadURL)
                        .then(snapshot => {
                          console.log("success");
                          vm.ruleForm = {
                            name: "",
                            desc: ""
                          };
                          vm.fileList = [];
                        })
                        .catch(err => console.log(err.message));
                    }
                  );
                });
              });
              this.$message.success("Success");
            })
            .catch(err => console.log(err.message));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onUploadChange(file, fileList) {
      if (file.size > 204800) {
        this.$message.error("file can not greater than 200kb");
        this.fileList = [];
      } else {
        this.fileList = fileList;
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    onSuccess(file) {
      // console.log(file);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    blobToDataURL(blob, callback) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob";

      xhr.onload = function() {
        var recoveredBlob = xhr.response;

        var reader = new FileReader();

        reader.onload = function() {
          var blobAsDataUrl = reader.result;
          callback(blobAsDataUrl);
        };

        reader.readAsDataURL(recoveredBlob);
      };

      xhr.open("GET", blob);
      xhr.send();
    }
  }
};
</script>
