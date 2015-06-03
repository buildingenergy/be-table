# cljsjs/papaparse

# Instalation
```sh
boot package build-jar
```
That will install be-table and lodash to your local maven repository located at `~/.m2` by default

Require be-table in your cljs app like a normal clj dependency
```clojure
[com.buildingenergy/be-table "0.0.1-0"] ;; latest release
```

# Usage

This jar comes with `deps.cljs` as used by the [Foreign Libs](https://github.com/clojure/clojurescript/wiki/Foreign-Dependencies) feature
of the Clojurescript compiler. After adding the above dependency to your project
you can require the packaged library like so:

```clojure
(ns application.core
  (:require cljsjs.be-table))
```
