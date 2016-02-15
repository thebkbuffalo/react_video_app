class UrlToSomethingElse < ActiveRecord::Migration
  def change
    rename_column :videos, :url, :embed
  end
end
