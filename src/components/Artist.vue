  <template>
      <div style="padding: 20px;">
        <el-row>
            <el-button @click.native="addArtist">Add Artist</el-button>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
              <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        :formatter="dateFormatter"
        label="Date"
        width="180">
      </el-table-column>
      <el-table-column
        prop="khName"
        label="KH Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="Description">
      </el-table-column>
       <el-table-column
        prop="image_url"
        label="Image">
        <template slot-scope="scope">
          <img :src="scope.row.image_url" class="image">
          </template>
      </el-table-column>  
      <el-table-column label="Action" width="75">
        <template slot-scope="scope">
          <el-button @click.native="removeArtist(scope.$index, scope.row)" type="warning" size="mini">Remove</el-button>
        </template>
      </el-table-column>
    </el-table>
            </el-col>
        </el-row>
      </div>
  </template>

  <script>
import firebase from "../firebaseInit.js";
import { format } from "date-fns";
export default {
  methods: {
    addArtist() {
      this.$router.push({ name: "NewArtist" });
    },
    dateFormatter(row) {
      return format(row.date, "DD/MM/YYYY HH:mm");
    },
    removeArtist(index, row) {
      firebase.db
        .collection("artists")
        .doc(row.id)
        .delete()
        .then(val => {
          this.$confirm("This will permanently delete. Continue?", "Warning", {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning"
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "Delete completed"
              });
              this.tableData.splice(index, 1);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "Delete canceled"
              });
            });
        });
    }
  },
  data() {
    return {
      tableData: []
    };
  },
  created() {
    firebase.db
      .collection("artists")
      .get()
      .then(snapshot => {
        let list = [];
        snapshot.forEach(doc => {
          let obj = doc.data();
          obj.id = doc.id;
          list.push(obj);
        });
        this.tableData = list;
      })
      .catch(err => console.log(err.message));
  }
};
</script>

<style scope>
.image {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
