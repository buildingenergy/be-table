(set-env!
  :resource-paths #{"resources"}
  :dependencies '[[adzerk/bootlaces   "0.1.11" :scope "test"]
                  [cljsjs/boot-cljsjs "0.4.8" :scope "test"]])

(require '[boot.core :as boot-core]
         '[adzerk.bootlaces :refer :all]
         '[cljsjs.boot-cljsjs.packaging :refer :all])

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

(deftask package []
  (comp
   (download-lodash)
   (sift :move {#"^lodash.js" "cljsjs/be-table/development/lodash.inc.js"
                #"^lodash.min.js" "cljsjs/be-table/production/lodash.min.inc.js"
                #"^js/be-table.js" "cljsjs/be-table/development/be-table.inc.js"
                #"^js/be-table.min.js" "cljsjs/be-table/production/be-table.min.inc.js"})
   (sift :include #{#"^cljsjs"})
   (deps-cljs :name "cljsjs.be-table")))
