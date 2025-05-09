/**
 * JavaScript for Django Treebeard Admin
 */
function tree_init(result_list, tree_data, treeOptions) {
    var defaults = {
        dragAndDrop: true,
        onCanMoveTo: function(moved_node, target_node, position) {
            return true;
        }
    };
    
    var options = $.extend({}, defaults, treeOptions);
    
    // Store the node data for later use
    var nodeData = {};
    for (var i = 0; i < tree_data.length; i++) {
        nodeData[tree_data[i].id] = tree_data[i];
    }
    
    // Add indentation and collapse/expand icons
    result_list.find('tr').each(function() {
        var row = $(this);
        var node_id = row.attr('node-id');
        if (!node_id) return;
        
        var node = nodeData[node_id];
        if (!node) return;
        
        // Determine level from the structure
        var level = 0;
        var parent_id = node.parent_id;
        while (parent_id) {
            level++;
            parent_id = nodeData[parent_id] ? nodeData[parent_id].parent_id : null;
        }
        
        // Add indentation
        var firstCell = row.find('td:first');
        var padding = level * 20;
        firstCell.css('padding-left', padding + 'px');
        
        // Add collapse/expand icon if has children
        if (node.children && node.children.length > 0) {
            var icon = $('<span class="treebeard-collapse-icon">[-]</span>');
            icon.on('click', function() {
                toggleChildren(node_id);
            });
            firstCell.prepend(icon);
        }
        
        // Add drag handle if dragAndDrop is enabled
        if (options.dragAndDrop) {
            var handle = $('<span class="treebeard-drag-handler">::</span>');
            firstCell.prepend(handle);
        }
    });
    
    // Function to toggle children visibility
    function toggleChildren(node_id) {
        var node = nodeData[node_id];
        if (!node || !node.children) return;
        
        var isCollapsed = $.cookie('treebeard_' + node_id) === 'collapsed';
        $.cookie('treebeard_' + node_id, isCollapsed ? 'expanded' : 'collapsed');
        
        var icon = result_list.find('tr[node-id="' + node_id + '"] .treebeard-collapse-icon');
        
        if (isCollapsed) {
            // Expand
            icon.text('[-]');
            icon.removeClass('treebeard-collapsed').addClass('treebeard-expanded');
            showChildren(node_id);
        } else {
            // Collapse
            icon.text('[+]');
            icon.removeClass('treebeard-expanded').addClass('treebeard-collapsed');
            hideChildren(node_id);
        }
    }
    
    // Function to show children of a node
    function showChildren(node_id) {
        var node = nodeData[node_id];
        if (!node || !node.children) return;
        
        for (var i = 0; i < node.children.length; i++) {
            var child_id = node.children[i];
            result_list.find('tr[node-id="' + child_id + '"]').show();
            
            // If this child is expanded, show its children too
            if ($.cookie('treebeard_' + child_id) !== 'collapsed') {
                showChildren(child_id);
            }
        }
    }
    
    // Function to hide children of a node
    function hideChildren(node_id) {
        var node = nodeData[node_id];
        if (!node || !node.children) return;
        
        for (var i = 0; i < node.children.length; i++) {
            var child_id = node.children[i];
            result_list.find('tr[node-id="' + child_id + '"]').hide();
            
            // Hide children of this child too
            hideChildren(child_id);
        }
    }
    
    // Initialize the tree state from cookies
    result_list.find('tr').each(function() {
        var row = $(this);
        var node_id = row.attr('node-id');
        if (!node_id) return;
        
        var node = nodeData[node_id];
        if (!node) return;
        
        var isCollapsed = $.cookie('treebeard_' + node_id) === 'collapsed';
        var icon = row.find('.treebeard-collapse-icon');
        
        if (isCollapsed && node.children && node.children.length > 0) {
            icon.text('[+]');
            icon.removeClass('treebeard-expanded').addClass('treebeard-collapsed');
            hideChildren(node_id);
        }
    });
    
    // Setup drag and drop if enabled
    if (options.dragAndDrop) {
        result_list.find('tr').draggable({
            helper: 'clone',
            handle: '.treebeard-drag-handler',
            opacity: 0.7,
            start: function(event, ui) {
                $(this).addClass('tree-node-active');
            },
            stop: function(event, ui) {
                $(this).removeClass('tree-node-active');
            }
        });
        
        result_list.find('tr').droppable({
            accept: 'tr',
            hoverClass: 'tree-node-selected',
            drop: function(event, ui) {
                var target_id = $(this).attr('node-id');
                var moved_id = ui.draggable.attr('node-id');
                
                if (target_id === moved_id) return; // Can't drop on itself
                
                var target_node = nodeData[target_id];
                var moved_node = nodeData[moved_id];
                
                if (!target_node || !moved_node) return;
                
                // Determine position (before, after, inside)
                var position = 'after'; // Default
                
                // Check if move is allowed by the callback
                if (!options.onCanMoveTo(moved_node, target_node, position)) {
                    return;
                }
                
                // TODO: Send AJAX request to server to update the tree structure
                // This would normally post to a URL like:
                // window.location.pathname + moved_id + '/move-' + position + '/' + target_id + '/'
            }
        });
    }
} 