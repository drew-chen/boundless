# Installing gCloud (gsUtil)
[Installation Guide](https://cloud.google.com/storage/docs/gsutil_install)

Once the user has finished with the installation, follow the following cmd to export out the storage:

```sh
# gs://<bucket_name> can be retrieved from firebase storage or
$ gsutil.cmd -m cp -R gs://<bucket_name> .

$ cd <root>/app/server/firebase/storage

$ gsutil.cmd cors set cors.json gs://<bucket>

```

For a built-in util tools, please 'cd' into './tools/fbm' and follow the these [instructions.](../tools/fbm/README.md)
