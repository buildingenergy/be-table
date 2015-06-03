(set-env!
  :resource-paths #{"resources"}
  :dependencies '[[adzerk/bootlaces   "0.1.11" :scope "test"]
                  [cljsjs/boot-cljsjs "0.4.8" :scope "test"]])

(require '[boot.core :as c]
         '[boot.tmpdir :as tmpd]
         '[adzerk.bootlaces :refer :all]
         '[cljsjs.boot-cljsjs.packaging :refer :all]
         '[clojure.java.io :as io])

(def be-table-version "0.0.1")
(def +version+ (str be-table-version "-0"))

(defn lodash-url [filename]
  (str "https://raw.githubusercontent.com/lodash/lodash/master/" filename))

;; js files located in ../build:
;;   js/be-table.js
;;   js/be-table.min.js
(set-env! :resource-paths #(conj % "../build"))

(task-options!
  pom  {:project     'com.buildingenergy/be-table
        :version     +version+
        :description "React component for rendering tables of data"
        :url         "https://github.com/buildingenergy/be-table"
        :scm         {:url "https://github.com/buildingenergy/be-table"}})

(deftask download-lodash []
  (comp
   (download :url (lodash-url "lodash.js"))
   (download :url (lodash-url "lodash.min.js"))))

(defn find-file [fs filename]
  (->> fs c/input-files (c/by-name [filename]) first))

(deftask concatenate-files []
  (c/with-pre-wrap fileset
    (let [tmp (c/temp-dir!)
          new-dev-file (io/file tmp "cljsjs/be-table/development/be-table.inc.js")
          new-min-file (io/file tmp "cljsjs/be-table/production/be-table.min.inc.js")
          lodash-dev-file (find-file fileset "lodash.js")
          lodash-min-file (find-file fileset "lodash.min.js")
          table-dev-file (find-file fileset "be-table.js")
          table-min-file (find-file fileset"be-table.min.js")]
      (io/make-parents new-dev-file)
      (io/make-parents new-min-file)
      (spit new-dev-file (str (-> lodash-dev-file tmpd/file slurp)
                              (-> table-dev-file tmpd/file slurp)))
      (spit new-min-file (str (-> lodash-min-file tmpd/file slurp)
                              (-> table-min-file tmpd/file slurp)))
      (-> fileset (c/add-resource tmp) c/commit!))))

(deftask package []
  (comp
   (download-lodash)
   (concatenate-files)
   (deps-cljs :name "cljsjs.be-table")
   (sift :include #{#"^cljsjs" #"^deps\.cljs$"})))
