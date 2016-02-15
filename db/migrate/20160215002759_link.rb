class Link < ActiveRecord::Migration
  def change
    rename_column :videos, :link, :url
  end
end
