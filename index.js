const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/dosyalar"))

const Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://mali:Z5KEL3jYrRIeR09Y@cluster0.swiqm.mongodb.net/Cluster0?retryWrites=true&w=majority", {useNewUrlParser : true , useUnifiedTopology : true });  

const guzelSozSema = {
    kategori : String,
    icerik : String
}; 
  const GuzelSoz = mongoose.model("GuzelSoz", guzelSozSema );

//anasayfaya yönlendirelim,veri tabanından bulup bütün sozleri anasayfa getiriyoruz
 app.get("/", function(req,res){
     GuzelSoz.find({}, function(err, gelenSozler){
            res.render("anasayfa", {sozler: gelenSozler});    
            //console.log(gelenSozler)   ;
     });
 });
                 
//route yöntemi
// id sine göre güzel sözleri JSON formatında route edelim

app.route("/api/guzelsoz/:id")
.get(function(req,res){

        GuzelSoz.findOne({_id:req.params.id}, function(err, gelenVeri){
            res.send(gelenVeri);
        })
})
.put(function(req,res){
            //değişirmek isenen değerleri alıyorz
        var kategoriGelen = req.body.kategori;
        var icerikGelen = req.body.icerik;
                   //{updete edeceğimiz id},{değişirmek isenen değerleri}                   
        GuzelSoz.update({_id:req.params.id},{kategori:kategoriGelen, icerik:icerikGelen }, {overwrite:true}, function(err){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Kayıt Basarı ile güncellendi");
            }else{//error varsa erroru send et, göster
                res.send(err);
            }
        });
})
.patch(function(req,res){
                        
        GuzelSoz.update({_id:req.params.id},{$set: req.body /*{icerik : "hadibakalim", kategori : "tabiat"}*/ }, function(err){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Kayıt Basarı ile güncellendi");
            }else{//error varsa erroru send et, göster
                res.send(err);
            }
        });
})
.delete(function(req,res){

      var sifre = req.body.sifre;
      if(sifre == "parola1234"){

        GuzelSoz.deleteOne({_id:req.params.id}, function(err){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Basarı ile silindi");
            }else{//error varsa erroru send et, göster
               res.send(err);
            }

        });
      }else{
        res.send({sonuc : "Şifre hatalı."});
      }
});

// id siz güzel sözleri JSON formatında route edelim
app.route("/api/guzelsozler")
.get(function(req,res){
 
                    //{}all değerleri getirmek için
        GuzelSoz.find({}, function(err, gelenVeriler){
             
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send(gelenVeriler);
            }else{//error varsa erroru send et, göster
                res.send(err);
            }
        })
})
.post( function(req,res){
    // yazılan verileri almak için
    var kategori = req.body.kategori;
    var icerik = req.body.icerik;

    //yazılan verilerden model olusturmak için
    var  guzelSoz = new GuzelSoz({
                kategori:kategori,
                icerik :icerik
            });
         // veri tabanına kayıt ediyorz   
        guzelSoz.save(function(){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Basarı ile kaydedildi")
            }else{//error varsa erroru send et, göster
                res.send(err);
            }
        });
})
.delete(function(req,res){

        var sifre = req.body.sifre;
      if(sifre == "parola1234"){

        GuzelSoz.deleteMany({}, function(err){
            
            if(!err){// error yoksa, aşagıdakini yazdır
                res.send("Tüm kayıtlar Basarı ile silindi");
            }else{//error varsa erroru send et, göster
               res.send(err);
            }
        })
        }else{
        res.send({sonuc : "Şifre hatalı."});
      }
});

//
app.get("/admin", function(req, res){
    // 1. Alternatif
    /*GuzelSoz.find({}, function(err, gelenGuzelSozler){
      res.render("admin", {guzelsozler : gelenGuzelSozler});
    })*/
    var link = "https://guzelsozlere.herokuapp.com/api/guzelsozler";
    https.get(link , function(response){
      response.on("data", function(gelenGuzelSozler){
        // gelenGuzelSozler -> byte türünde gelmişti.
        var guzelSozler = JSON.parse(gelenGuzelSozler);
        res.render("admin", { sozler : guzelSozler } );
      })
    });
});

//https://guzelsozler.herokuapp.com/api/guzelsoz/600c683c986f50001534a062
app.post("/kayit-sil", function(req, res){
    var id = req.body._id;
    var link = "https://guzelsozlere.herokuapp.com/api/guzelsoz/"+id;
    const gonderilecekler = JSON.stringify({
      sifre: 'parola1234'
    })
    const secenekler = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Content-Length': gonderilecekler.length
      }
    }
    const baglanti = https.request(link, secenekler, function(response) {
      response.on('data', function(gelenVeri) {
        var sonuc = JSON.parse(gelenVeri);
        res.send(sonuc);
      })
    })
    baglanti.write(gonderilecekler);
    baglanti.end();
});


let port = process.env.PORT;
if (port == "" || port == null) {
    port = 5000;
}

app.listen(port, function(){
    console.log("port numarası : " +  port);
});